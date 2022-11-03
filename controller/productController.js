const db = require("../db/db.config");
const Products=db.products
const Category=db.category
const response=require("../CommonResponse/response")

const updateCategory=async(req,res,next)=>{
    const {id,type}=req.body;
     const [category,created]  =  await Category.findOrCreate({
            where:{id:id?id:null},
            defaults:{
                type
            }
          })
          if(created)
          {
            return response.success(res,200,"Category created successfully")
          }
          if(!category)
          {
            return response.error(res,400,"No user found")
          }
          await Category.update({type},{where:{id}})
          response.success(res,200,"Category updated successfully")

}

const updateProduct=async(req,res,next)=>{
    try{
        const {id,title,description,quantity,price,CategoryId}=req.body;
        console.log(title)
    const [product,created]  =  await Products.findOrCreate({
           where:{id:id?id:null},
           defaults:{
              title,
              description,
               quantity,
               price,
               CategoryId

           }
         })
         if(created)
         {
           return response.success(res,200,"Product created successfully")
         }
         if(!product)
         {
           return response.error(res,400,"No product found")
         }
         await Products.update({description},{where:{id}})
         response.success(res,200,"Product updated successfully")
    }
    catch(err)
    {
      response.error(res,400,err.name)
    }
   
}

const getProducts=async(req,res,next)=>{
  const {page,size} =  req.query
  const limit=size?size:1
  const offset=page?(page-1)*limit:0
     const data=await Products.findAll({ 
          limit,
          offset
        })
        response.success(res,200,"Product list",data)
}

module.exports={
    updateCategory,
    updateProduct,
    getProducts
}