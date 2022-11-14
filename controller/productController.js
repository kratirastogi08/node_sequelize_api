const db = require("../db/db.config.js");
const Products = db.products;
const Category = db.category;
const ProductRatings=db.productRatings;
const User= db.users;
const response = require("../CommonResponse/response");
const cloudinary = require("cloudinary");
const { Op } = require("sequelize");

const updateCategory = async (req, res, next) => {
  try{
    const { id, type } = req.body;
    const [category, created] = await Category.findOrCreate({
      where: { id: id ? id : null },
      defaults: {
        type,
      },
    });
    if (created) {
      return response.success(res, 200, "Category created successfully");
    }
    if (!category) {
      return response.error(res, 400, "No user found");
    }
    await Category.update({ type }, { where: { id } });
    response.success(res, 200, "Category updated successfully");
  }
  catch(err)
  {
      next(err)
  }
  
};

const updateProduct = async (req, res, next) => {
  try {
    const {images } =req.body;
    const imagesLinks = [];
    if(images && images.length)
    {
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    req.body.images=imagesLinks
    const [product, created] = await Products.findOrCreate({
      where: { id: req.body.id ? req.body.id: null },
      defaults: {
        ...req.body   
      },
    });
    if (created) {
      return response.success(res, 200, "Product created successfully");
    }
    if (!product) {
      return response.error(res, 400, "No product found");
    }
    await Products.update({ ...req.body }, { where: { id:req.params.id } });
    response.success(res, 200, "Product updated successfully");
  } catch (err) {
    next(err)
  }
};

const getProducts = async (req, res, next) => {
  const { page, size } = req.query;
  const limit = size ? size : 1;
  const offset = page ? (page - 1) * limit : 0;
  const data = await Products.findAll({
    limit,
    offset,
  });
  response.success(res, 200, "Product list", data);
};

const productRatings=async(req,res,next)=>{
  try{
    const {userId,productId,rating}=req.body;
    const currentRating= await ProductRatings.findOne({where:{[Op.and]: [
     { userId},
     { productId }
   ]}})
   if(!currentRating)
     {
    const newRating= await ProductRatings.create(req.body)
    response.success(res,200,"Rating created successfully",newRating);
    }
  const updatedRating=await ProductRatings.update({rating},{where:{userId,productId}})
   response.success(res, 200, "Rating updated successfully",updatedRating)
  }
  catch(err)
  {
    next(err)
  }
 
}

const getProductRatings=async(req,res,next)=>{
     const ratings= await ProductRatings.findAll({
       where:{productId:req.params.productId},
       include:[{model:Products,attributes:['title']},{model:User, attributes:{exclude:['firstName']}}],
       attributes:{exclude:['userId','productId']},
       order:[['rating', 'DESC']]   
      })
     return response.success(res,200,"Product ratings",ratings)
}

const getAvgRating=async(req,res,next)=>{
     const data= await ProductRatings.findAll({
      attributes:["productId",[db.sequelize.fn('ROUND',db.sequelize.fn('AVG',db.sequelize.col('rating'))),'avgRating']],
        group:['productId'],    
      })
      res.send(data)
}

const generalFn=async(req,res,next)=>{
  //no of products user provided rating for
  // const data=await ProductRatings.findAll({
  //   attributes:["userId",[db.sequelize.fn('COUNT',db.sequelize.col('productId')),"count"]],
  //   group:['userId']
  // })

  // user info with ratings--outer join
  // const data=await User.findAll({
  //   include:[{model:ProductRatings}],
  // })

  //user info with ratings--inner join
  // const data=await User.findAll({
  //      include:[{model:ProductRatings,required:true}],
  //    })
    

  //user info with ratings--inner join--only those rating with productId=3
     const data=await User.findAll({
      include:[{model:ProductRatings,required:true,where:{productId:{[Op.eq]:3}}}],
    })

  res.send(data)
}

module.exports = {
  updateCategory,
  updateProduct,
  getProducts,
  productRatings,
  getProductRatings,
  getAvgRating,
  generalFn
};
