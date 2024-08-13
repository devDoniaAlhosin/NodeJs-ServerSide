const { validationResult } = require("express-validator");
const Genre = require("../models/genres");

//All books
const getallgenres = async (req, res) => {
  try{
    const genres = await Genre.find();
    res.json(genres);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
}
 
};

  
//Single GENRE
const getgenre = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.genreID);
    if (!genre) {
      return res.status(404).json({ msg: "genre not found" });
    }
    return res.json(genre);
  } catch (err) {
    return res.status(400).json({ msg: "invalid Object ID" });
  }
};
//Add genre
const addgenre = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
    const newGenre = new Genre(req.body);
    await newGenre.save()
  }
  res.status(201).json(newGenre);
};

//Update genre
const updategenre = async (req, res) => {
  const genreId = req.params.genreId;

  try {
    const updatedgenre = await Genre.updateOne({_id:genreId}, {
      $set: { ...req.body },
    });

    return res.status(200).json(updatedgenre);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

//Delete genre
const deletegenre = async (req, res) => {
const deleted=await Genre.deleteOne({_id:req.params.genreId})
  res.status(200).json({ success: true });
};
module.exports = {
  getallgenres,
  getgenre,
  addgenre,
  updategenre,
  deletegenre,

};
