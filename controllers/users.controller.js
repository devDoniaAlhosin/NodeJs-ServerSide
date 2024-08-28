const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../models/users");
const httpStatusText = require("../utilities/httpStatusText");
const appError = require("../utilities/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utilities/generateJWT");
const Book = require("../models/books");
const Author = require("../models/authors");
const passport = require("../config/passport");
// ////
const { PassThrough } = require("stream");
const cloudinary = require("../utilities/cloudinary");
const upload = require("../middleware/multer");

// get all users
const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  // get all Users from DB using Users Model
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

// register
// const register = asyncWrapper(async (req, res, next) => {
//   const { name, email, username, password, role, avatar } = req.body;
//   const oldUserEmail = await User.findOne({ email: email });
//   const oldUserUsername = await User.findOne({ username: username });
//   if (oldUserEmail || oldUserUsername) {
//     const error = appError.create(
//       "user already exists",
//       400,
//       httpStatusText.FAIL
//     );
//     return next(error);
//   }

//   // Password hashing
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // adding user
//   const newUser = new User({
//     name,
//     email,
//     username,
//     password: hashedPassword, // should be hashed First
//     role,
//     avatar: req.file.filename,
//   });

//   // generate JWT token
//   const token = await generateJWT({
//     username: newUser.username,
//     id: newUser._id,
//     role: newUser.role,
//   });
//   newUser.token = token;

//   await newUser.save();

//   res
//     .status(201)
//     .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
// });

const register = asyncWrapper(async (req, res, next) => {
  const { name, email, username, password, role } = req.body;

  // Check if user already exists
  const oldUserEmail = await User.findOne({ email });
  const oldUserUsername = await User.findOne({ username });

  if (oldUserEmail || oldUserUsername) {
    return next(appError.create("User already exists", 400));
  }

  // Password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  let avatarUrl = null;

  if (req.file) {
    try {
      const streamUpload = (stream) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "avatars",
              transformation: [
                { width: 500, height: 500, crop: "limit" },
                { fetch_format: "auto", quality: "auto" },
              ],
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                return reject(error);
              }
              resolve(result);
            }
          );
          stream.pipe(uploadStream);
        });
      };

      // Use PassThrough stream to handle file upload
      const stream = new PassThrough();
      stream.end(req.file.buffer); // Pipe the buffer to the PassThrough stream
      const result = await streamUpload(stream);
      avatarUrl = result.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return next(appError.create("Image upload failed", 500));
    }
  }

  // Create new user
  const newUser = new User({
    name,
    email,
    username,
    password: hashedPassword,
    role,
    avatar: avatarUrl, // Save Cloudinary URL
  });

  // Generate JWT token
  const token = await generateJWT({
    username: newUser.username,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;

  await newUser.save();

  res.status(201).json({ status: "success", data: { user: newUser } });
});

// login
const login = asyncWrapper(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username && !password) {
    const error = appError.create(
      "Email and Password are Required",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const user = await User.findOne({ username: username });

  if (!user) {
    const error = appError.create("user not found", 400, httpStatusText.FAIL);
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    // logged in successfully

    const token = await generateJWT({
      username: user.username,
      id: user._id,
      role: user.role,
    });

    return res.json({ status: httpStatusText.SUCCESS, data: { token } });
  } else {
    const error = appError.create("something wrong", 500, httpStatusText.ERROR);
    return next(error);
  }
});

// Add UserBooks
const addBookToUser = asyncWrapper(async (req, res, next) => {
  const { rating, status } = req.body;
  const { userId, bookId } = req.params;

  // Find user by ID
  const user = await User.findById(userId);

  if (!user) {
    return next(appError.create("User not found", 404, httpStatusText.FAIL));
  }

  const book = await Book.findById(bookId)
    .populate("author")
    .populate("genre")
    .exec();

  const existingBookIndex = user.books.findIndex(
    (b) => b.book && b.book.toString() === bookId
  );

  if (!book) {
    if (existingBookIndex !== -1) {
      user.books.splice(existingBookIndex, 1);
      await user.save();
    }
    return next(
      appError.create(
        "Book not found and removed from user's collection",
        404,
        httpStatusText.ERROR
      )
    );
  }

  if (existingBookIndex !== -1) {
    user.books[existingBookIndex].status =
      status || user.books[existingBookIndex].status;

    if (rating !== undefined && rating !== null) {
      user.books[existingBookIndex].rating = rating;
    }
  } else {
    user.books.push({
      book: book._id,
      status: status || userStatus.NOTREAD,
      rating: rating !== undefined && rating !== null ? rating : 0,
      title: book.title,
      description: book.description,
      published: book.published,
      bookRating: book.rating,
      reviews_count: book.reviews_count,
      isbn: book.isbn,
      image: book.image,
    });
  }

  await user.save();

  const populatedUser = await User.findById(userId)
    .populate({
      path: "books.book",
      select: "title description published rating reviews_count isbn image",
    })
    .exec();

  res.status(200).json({
    status: "success",
    data: populatedUser.books,
  });
});

// Get UsersBooks
const getBookToUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).populate("books.book").exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.books = user.books.filter((b) => b.book !== null);

  res.json(user.books);
});

// Check User Existance
const checkUserExists = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
      exists: false,
    });
  }

  res.status(200).json({
    status: "success",
    exists: true,
  });
});

module.exports = {
  getAllUsers,
  register,
  login,
  addBookToUser,
  getBookToUser,
  checkUserExists,
};
