const mongoose=require('mongoose');
const gallerySchema=new mongoose.Schema({
    images:[String]
})
module.exports=mongoose.model('Gallery',gallerySchema);
