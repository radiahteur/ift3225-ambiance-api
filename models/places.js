// Modèle représentant un lieu.
// Un lieu peut être associé à des mesures et des observations.

const mongoose=require("mongoose");


const placeSchema=new mongoose.Schema({

name:{
type:String,
required:true
},


location:{
type:String,
required:true,
unique:true,
lowercase:true
},


latitude:{
type:Number,
required:true
},


longitude:{
type:Number,
required:true
},


description:{
type:String,
default:""
}

},
{
timestamps:true
});


module.exports=mongoose.model("Place",placeSchema);
