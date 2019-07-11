const jwt = require("jsonwebtoken")
require("./db/mongoose");
const  User = require("./core/SessionData");
//arn:aws:execute-api:us-east-2:114287217847:5cqm52yqai/ESTestInvoke-stage/GET/
const arnList = {'arn:aws:execute-api:us-east-2:114287217847:5cqm52yqai/Prod/POST/session/signup':['admin','super'], 'arn:aws:execute-api:us-east-2:114287217847:5cqm52yqai/Prod/GET/session/signup':['admin']}

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  callback(null, convertToResponse(event));
    // // convertToResponse(event)
    // const newUsers = JSON.parse(event.body);
    // const users = new User(newUsers); 
    //     users.save().then((value) => {
    //         let myResponse = {
    //             'statusCode': 200,
    //             'body': JSON.stringify({
    //                users:{
    //                 users
    //             }

    //         })};
    //         callback(null, myResponse)

    //     }).catch((err) => {

    //         callback(err, null)

    //     });
  }

// exports.auth = async(event) =>{
//     console.log("hola");
//     return event
//   }
exports.auth = async function (event) {
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoib3NjYXIiLCJpYXQiOjE1NjI3Nzc1MjV9.hxYietHjsQc2fBKjBwefXN3NyH7grs4M4-Cswl-WNW0"

const token = event.authorizationToken
const methodArn = event.methodArn
const decoded = jwt.verify(token, "lamodaesteneruntokenentusession")
try {

  const user = await User.findOne({ _id: decoded._id})
  console.log('HOla ', user);
  const hasPermission = userHasPermission(methodArn,user.rol);
  
  console.log("hasPermission", hasPermission);
  const allowed = hasPermission ? 'Allow' : 'Deny'
  console.log(user);
  return  generateAuthResponse(user.rol, allowed, methodArn, user._id)

} catch (err) {
    return convertToError(err);
  }
}
function generateAuthResponse (principalId, effect, methodArn, userId) {
  // If you need to provide additional information to your integration
  // endpoint (e.g. your Lambda Function), you can add it to `context`
  const context = {
    'userId': userId
  }
  const policyDocument = generatePolicyDocument(effect, methodArn)

  return {
    principalId,
    context,
    policyDocument
  }
}

function generatePolicyDocument (effect, methodArn) {
  if (!effect || !methodArn) return null

    const policyDocument = {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn
      }]
    }

    return policyDocument
  }





  exports.login = async (event, context) => {
        // // const token = event.headers.token
        // // const decoded = jwt.verify(token, 'lamodaesteneruntokenentusession', (err, res)=>{
        //   if(err){
        //     console.log("error en el token", err);
        //   }
        //   console.log("true", res);
        // });
        // // const user = await User.findOne({ _id: decoded._id, 'tokens.token':token});
        
        try {
          const loginParams = JSON.parse(event.body);
          const loggedUser = await customLogin(loginParams.user, loginParams.password);
          return convertToResponse(loggedUser);

        }catch(err){
          return convertToError(err);
        }
        return res
      }

      const customLogin = (user, password)=>{

        return  new Promise((resolve, reject) => {
          User.findByCredentials(user, password).then((foundUser) =>{

            const rol = foundUser.rol
            const userName = foundUser.user
            foundUser.generateAuthToken().then((token) => {
              resolve({rol, userName, token:{token}});
            }).catch((err) => {
              reject(err);
            });
          }).catch((err) => {
            reject(err);
          });
        });
      }
      const convertToResponse=(value)=>{
        return {
          'statusCode': 200,
          'body': JSON.stringify(value),
          headers: {}
        }
      }
      const convertToError = (err)=>{
        return {
          'statusCode': 500,
          'body': JSON.stringify(err),
          headers: {}
        }

      }

      const userHasPermission = (methodArn, rol)=>{
        const arnValue = arnList[methodArn];

        var i, len, text;
        for(i = 0, len = arnValue.length, text = ""; i < len; i++){
            text = arnValue[i]
          console.log(text);
            if(text === rol){
              return true
            }
        }



        return false;

      }