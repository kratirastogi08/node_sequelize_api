const Joi = require('joi');

const signupSchema = Joi.object().keys({
    firstName:Joi.string().required().empty(''),
    lastName:Joi.string().required().empty(''),
    phone:Joi.string().regex(/^[7-9]{1}[0-9]{9}$/).required().empty('').error(errors => {
        errors.forEach(err => {
            console.log(err)
          switch (err.type) {
            case "string.regex.base":
              err.message = "Invalid phone number!";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
     email: Joi.string().email().required().empty(''),
     password:Joi.string().min(3).max(15).required().empty(''),
     role:Joi.string().optional().empty(''),
})

const signInSchema = Joi.object().keys({
     email: Joi.string().email().required().empty(''),
     password:Joi.string().required().empty('')
})

const productSchema = Joi.object().keys({
    title: Joi.string().required().empty(''),
    description:Joi.string().required().empty(''),
    quantity:Joi.number().required(),
    price:Joi.number().required(),
    CategoryId:Joi.number().required()
})

const updateProductSchema=Joi.object().keys({
    id:Joi.number().required(),
    title: Joi.string().optional(),
    description:Joi.string().optional(),
    quantity:Joi.number().optional(),
    price:Joi.number().optional(),
    CategoryId:Joi.number().optional()
})

module.exports={
 signupSchema,
 signInSchema,
 productSchema,
 updateProductSchema
}