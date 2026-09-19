//import mongoose
const mongoose=require("mongoose");

//
const bcrypt =require("bcrypt");


//create schema
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique: true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true,
},

})

UserSchema.pre("save", async function(){
  if (!this.isModified("password")) return 
  this.password = await bcrypt.hash(this.password,10);
})



//define model
const UserModel = mongoose.model("user",UserSchema)

//export model
module.exports=UserModel;