const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:String
    }
},{
    timestamps:true
})

module.exports=mongoose.model('User',userSchema);