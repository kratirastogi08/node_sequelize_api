const {format,createLogger,transports}=require('winston')
const {timestamp,combine,json,errors}=format;

function buildProdLogger(){
   const logger=createLogger({
      level: 'info',
      format:combine(
          timestamp(),
          errors({stack:true}),
          json()),
          defaultMeta:{service:'user-service'},
      transports:[
          new transports.Console()
      ]
  })
  return logger
}

module.exports=buildProdLogger