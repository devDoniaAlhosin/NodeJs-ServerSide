const mongoose=require("mongoose");
const authorsSchema=new mongoose.Schema({
  name: String,
  bio: String,
  birthDate: Date,
  nationality: String,
  image: String
 
})

module.exports=mongoose.model('Author',authorsSchema);