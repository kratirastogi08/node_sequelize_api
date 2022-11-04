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
dotenv.config()
db.connectToDatabase()


app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
var options = {
    swaggerDefinition: swaggerDocument,
    apis: ['./routes/*.js'],
  };
const specs=swaggerJsDoc(options)
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs))
app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/order",orderRouter)
 
 
app.listen(5001,()=>{
    console.log("server is running")
})