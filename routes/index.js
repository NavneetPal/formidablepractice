const express=require('express');
const router=express.Router();
const formidable=require('formidable');
const path=require('path');
const fs=require('fs');
const User=require('../models/user');
const Gallery=require('../models/gallery');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');

router.get('/',(req,res)=>{
    res.redirect('/home');
})

router.get('/home',async(req,res)=>{
   const galleries=await Gallery.find().limit(1);

   res.render('home',{images:galleries[0].images});
})

router.get('/register',(req,res)=>{
    res.render('register');
});

router.post('/register',async(req,res)=>{
    const form=formidable({
        multiples:true,
        uploadDir:path.join(__dirname,'..','uploads'),
        keepExtensions:true
    }); 

    form.parse(req,(err, fields, files)=>{
        if (err) {
            next(err);
            return;
        }

        if(files.images.length){
            files.images.forEach(image=>{
                const oldpath=image.path;
               const newPath=path.join(__dirname,'..','uploads',image.name);
               fs.rename(oldpath,newPath,(err)=>{
                   if(err) throw err;
               })
           })
           const {email,password}=fields;
            User.create({
                email:email,
                password:bcrypt.hashSync(password,10),
                image:'/uploads/'+files.images[0].name
            })
            res.redirect('/user');
        }else{
            const oldpath=files.images.path;
            const newPath=path.join(__dirname,'..','uploads',files.images.name);
            fs.rename(oldpath,newPath,(err)=>{
                if(err) throw err;
            })
            const {email,password}=fields;
            User.create({
                email:email,
                password:bcrypt.hashSync(password,10),
                image:'/uploads/'+files.images.name
            })
            res.redirect('/user');
        }

    })
});



router.get('/user',async(req,res)=>{
    const users=await User.find({});
    res.render('user',{users});
})


router.get('/gallery',(req,res)=>{
    res.render('gallery');
})

router.post('/gallery',(req,res)=>{
    const form=formidable({
        multiples:true,
        uploadDir:path.join(__dirname,'..','uploads'),
        keepExtensions:true
    }); 

    form.parse(req,(err,fields,files)=>{
        if(err){
            next(err);
            return;
        }


        if(files.images.length){
            files.images.forEach(image=>{
                const oldpath=image.path;
               const newPath=path.join(__dirname,'..','uploads',image.name);
               fs.rename(oldpath,newPath,(err)=>{
                   if(err) throw err;
               })
           })
           let galleryImages=files.images.map(image=>{
               return '/uploads/'+image.name;
           })
            Gallery.create({
                images:galleryImages
            })
            res.redirect('/');
        }else{
            const oldpath=files.images.path;
            const newPath=path.join(__dirname,'..','uploads',files.images.name);
            fs.rename(oldpath,newPath,(err)=>{
                if(err) throw err;
            })
            Gallery.create({
                images:'/uploads/'+files.images.name
            })
            res.redirect('/');
        }
    })
})


router.post('/subscribe',(req,res)=>{
    const {toEmail}=req.body;

    console.log(process.env.GMAIL_PASS);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

      var mailOptions = {
        from: process.env.GMAIL_USER,
        to: toEmail,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
})

module.exports=router;