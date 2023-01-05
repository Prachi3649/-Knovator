//const jwt = require('jsonwebtoken')

// const authentication = async function (req, res, next) {
//     try {
//         const token = req.headers.authorization;
//         if (token) {
//             bearertoken = token.split(" ")
//             const decoded = jwt.verify(bearertoken[1], 'privatekey')
//             if (decoded) {
//                 req.decodedToken = decoded
//             }
//             else {
//                 return res.status(401).send({ status: false, msg: "invalid authentication token" })
//             }
//         }else{
//             return res.status(403).send({ status: false, message: `Missing authentication token in request` })
//         }
//         next()
//     } catch (error) {
//         return res.status(500).send({ status: false, msg: error.message })
//     }
// }


const jwt =  require("jsonwebtoken")
var log4js = require("log4js");

var logger = log4js.getLogger('Auth/Middleware'); 

logger.level = "info";

const authentication = async (req,res,next) => {
    logger.info('Under Authentication')
    let token = req.header("x-api-key")
    if (!token) {
        logger.error('Provide Token')
        return res.status(401).send({ status: false, msg: "token must be present" })};

   let decodedtoken = jwt.verify(token, "thisismysecrutekey");
   if (!decodedtoken) return res.status(400).send ({staus : false, message: "token is invalid"})

   req.decodedToken = decodedtoken

   next()
}

module.exports.authentication = authentication



