
const FCM=require('fcm-node')
const androidPushNotification=(req,res,next)=>{
    const serverKey='AAAAyk3J99E:APA91bFdGNUk2ixspHmD6CmcSYxHsGSF7ros2lF65DHeyWdj28qTumhjdLGJ3505QNCOCkSj3R2WDq7i9PtNlftGZxbpINJsjOGUcR2MBHdgwL-40Q0_3gKtHARXfM6YSQxD4SRqyK7I'
    const fcm=new FCM(serverKey)
    const message={
        to:req.body.deviceToken,
        collapse_key:`TEST`,
        notification:{
            title:`TEST`,
            body:'{"Message from node js app"}',
            sound:`ping.aiff`,
            delivery_receipt_requested:true,
        },
        data:{
            title:'ok vgf',
            body:'{"name":"jh","product_id":"123","final_price":"0.0036"}'
        }

    }
    fcm.send(message,function(err,res){
     if(err)
     {
        console.log("Something went wrong"+err)
     }
     else{
        console.log("Successfully sent with response",res)
     }
    })
}
module.exports={
    androidPushNotification
}