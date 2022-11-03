exports.error=async(res,code,message)=>{
  try{
   const response={
    success:false,
    status_code:code,
    message
   }
   return res.status(code).json(response)
  }
  catch(err)
  {
return res.status(500).json({
    success: false,
        status_code: 500,
        message:message? message:"INTERNAL_SERVER_ERROR"
})
  }
}

exports.success=async(res,code,message="",data={})=>{
    try{
        const response={
            success:true,
            status_code:code,
            message,
            data
           }
           res.status(code).json(response)
    }
    catch(err)
    {
        res.status().json({
            success: true,
                status_code: 500,
                message:message? message:"INTERNAL_SERVER_ERROR"
    })
}
}