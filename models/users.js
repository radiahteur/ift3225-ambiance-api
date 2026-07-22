// Modèle représentant un utilisateur.
// Les utilisateurs peuvent s'authentifier et enregistrer des lieux favoris.

const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

username:{
    type:String,
    required:true,
    unique:true,
    trim:true
},

email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true
},

password:{
    type:String,
    required:true
},


favorites:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"Place"
}
]


},
{
timestamps:true
});


module.exports = mongoose.model("User",userSchema);