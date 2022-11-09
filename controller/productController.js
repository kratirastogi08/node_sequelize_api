const db = require("../db/db.config.js");
const Products = db.products;
const Category = db.category;
const ProductRatings=db.productRatings;
const User= db.users;
const response = require("../CommonResponse/response");
const cloudinary = require("cloudinary");

const updateCategory = async (req, res, next) => {
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
    console.log(err)
    response.error(res, 400, err.name);
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
  const {userId,productId,rating}=req.body;
     const currentRating= await ProductRatings.findOne({userId,productId})
    if(!currentRating)
      {
     const newRating= await ProductRatings.create(req.body)
     response.success(res,200,"Rating created successfully",newRating);
     }
   const updatedRating=await ProductRatings.update({rating},{where:{userId,productId}})
    response.success(res, 200, "Rating updated successfully",updatedRating)
}

const getProductRatings=async(req,res,next)=>{
     const ratings= await ProductRatings.findAll({
       where:{id:req.params.productId},
       include:[{model:Products},{model:User, attributes:{exclude:['firstName']}}],
       attributes:{exclude:['userId','productId']},
       order:[['rating', 'DESC']]   
      })
      response.success(res,200,"Product ratings",ratings)
}

const getAvgRating=async(req,res,next)=>{
     const data= await ProductRatings.findAll({
      attributes:["productId",[db.sequelize.fn('ROUND',db.sequelize.fn('AVG',db.sequelize.col('rating'))),'avgRating']],
        group:['productId'],
        
      })
      res.send(data)
}

module.exports = {
  updateCategory,
  updateProduct,
  getProducts,
  productRatings,
  getProductRatings,
  getAvgRating
};
