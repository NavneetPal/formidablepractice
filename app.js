require('dotenv').config();
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const path=require('path');
const indexRoutes=require('./routes/index');
const mongoose= require('mongoose');
const chalk=require('chalk');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use("/css",express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js",express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));



const mongoUrl=process.env.NODE_ENV==='production'?'mongodb+srv://navneet:nakul@cluster0.aipts.mongodb.net/formidabledemo?retryWrites=true&w=majority':"mongodb://localhost:27017/formidabledemo";
mongoose.connect(mongoUrl,{
  useUnifiedTopology:true,
  useNewUrlParser:true
})
.then(()=>{
  console.log(chalk.green('DB connected...'));
})
.catch(err=>{
  console.log(err);
})


app.use('/',indexRoutes);



const PORT=3000 || process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
})