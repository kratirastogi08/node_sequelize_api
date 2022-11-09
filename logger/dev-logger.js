const {format,createLogger,transports}=require('winston')
const {timestamp,combine,printf}=format;

function buildDevLogger(){
    const logFormat=printf(({level,message,timestamp,stack})=>{

        return `${timestamp} ${level}: ${stack||message}`
  })
  const logger=createLogger({
      level: 'debug',
      format:combine(
          format.colorize(),
          timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
          logFormat,
          format.errors({stack:true})),
      transports:[
          new transports.Console()
      ]
  })
  return logger
}

module.exports=buildDevLogger