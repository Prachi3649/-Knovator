
var log4js = require("log4js");
const express =  require ("express")
const bodyParser = require ("body-parser")
const mongoose = require("mongoose")

var logger = log4js.getLogger('Index'); 
logger.level = "info";
const app = express()

app.use (bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


const router = require("./router/router")
app.use("/" , router)


mongoose.connect('mongodb+srv://pankaj:XHR0F0IrqL14JxKZ@cluster0.ajtoy.mongodb.net/Knovator-525',{useNewUrlParser:true})
.then( () =>logger.log("mongoose is contected..."))
.catch( err => logger.error(err))



app.listen (process.env.port || 3000 ,  () => {
    logger.log("Express is connected 3000")
})