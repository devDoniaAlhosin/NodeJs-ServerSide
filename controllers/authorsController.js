const { validationResult } = require("express-validator");
const Author=require('../models/authors');

//All authors
const getallAuthors=async (req,res)=>{
  try{
    const authors=await Author.find();
    res.json(authors)
  }
  catch (err) {
    res.status(500).json({ message: err.message });
}
}

//one author
const getauthor = async (req, res) => {
    try {
      const author = await Author.findById(req.params.authorId);
      if (!author) {
        return res.status(404).json({ msg: "author not found" });
      }
      return res.json(author);
    } catch (err) {
      return res.status(400).json({ msg: "invalid Object ID" });
    }
  };

//Add author

const addauthor=async(req,res)=>{
    console.log(res.body);
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
        const newAuthor = new Author(req.body)
        await newAuthor.save();
      }
      res.status(201).json(newAuthor);
}

//Update author
const updateAuthor = async (req, res) => {
    const authorId = req.params.authorId;
  
    try {
      const updatedauthor = await Author.updateOne({_id:authorId}, {
        $set: { ...req.body },
      });
  
      return res.status(200).json(updatedauthor);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  };
  
  //Delete author
  const deleteauthor = async (req, res) => {
  const deletedA=await Author.deleteOne({_id:req.params.authorId})
    res.status(200).json({ success: true });
  };
  module.exports = {
    getallAuthors,
    getauthor,
    addauthor,
    updateAuthor,
    deleteauthor,
  };