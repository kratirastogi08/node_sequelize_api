const response= require("../CommonResponse/response");
const databaseErrorHandler =(err,req,res,next)=>{
    try{
        var message=""
        if(err.name === "SequelizeForeignKeyConstraintError")
        {  console.log(err.parent.detail)
         const id=err.parent.detail.split(/[=\s]/)
          message=`No such ${id[1]} exists`
        }
        return response.error(res,400,message)
    }
    catch(err)
    {
        return response.error(res,500,"INTERNAL_SERVER_ERROR")
    }
    
}

module.exports={
    databaseErrorHandler
}