const Joi = require('joi');
const response=require("../CommonResponse/response")
const validate=(schema,source = 'body')=>async(req,res,next)=>{
    try {
        const data = req[source];
        const { error } = Joi.validate(data,schema,{abortEarly: false});
        const valid = error == null;
        if (valid) {
          return next();
        } else {
          const { details } = error;
          const message = details.map((i) => i.message).join(',');
          return response.error(res, 400, message);
        }
      } catch (error) {
        console.log('Error', error);
        return response.error(res,500,"INTERNAL_SERVER_ERROR");
      }
}

module.exports={validate}