const express=require('express')
const app = express();
const cors=require('cors');
const productRouter=require('./routes/productRouter')
const userRouter=require('./routes/userRouter')
const orderRouter=require('./routes/orderRouter')
const db=require('./db/db.config')
const dotenv=require('dotenv')
const swaggerUI=require("swagger-ui-express")
const swaggerDocument=require('./swagger.json')
const swaggerJsDoc=require("swagger-jsdoc")
const cloudinary = require("cloudinary");
const upload=require('express-fileupload')
const logger=require('./logger')
const multer=require('multer');
const path=require('path')
const helmet = require("helmet");
const {databaseErrorHandler}=require("./middleware/errorHandler")
const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads')
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+path.extname(file.originalname))
  }
})
dotenv.config()
db.connectToDatabase()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const multerUpload=multer({storage})
//app.use(upload())
app.use(express.static('public'));
app.use(cors())
app.use(helmet());
app.use(express.urlencoded({extended:true}))
app.use(express.json())
var options = {
    swaggerDefinition: swaggerDocument,
    apis: ['./routes/*.js'],
  };
const specs=swaggerJsDoc(options)
app.get('/fileupload',(req,res)=>{
  res.sendFile(__dirname+'/index.html')
})
app.post("/multer",multerUpload.single("file"),(req,res)=>{
  console.log(req)
  res.send("Image Upload")
})
app.get("/pay",function(req,res){
  res.sendFile(__dirname+'/public/payment.html')
})
app.get("/subs",function(req,res){
  res.sendFile(__dirname+'/public/subscription.html')
})
app.post('/fileUpload',(req,res)=>{
  console.log(req)
    if(req.files)
    {
      console.log(req.files)
      var file=req.files.file
      var filename=file.name
      file.mv('./uploads/'+filename,(err)=>{
        if(err)
        {
          res.send(err)
        }
        else
        {
          res.send("File uploaded successfully")
        }
      })
    }
})
// logger.info("text info")
// logger.warn("text warn")
// logger.error(new Error("something went wrong"))
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs))
app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/order",orderRouter)
app.use(databaseErrorHandler)
 
 
app.listen(5001,()=>{
    console.log("server is running")
})