const authorization = (event) => {

  const token = event.authorizationToken
  const methodArn = event.methodArn
  const decoded = jwt.verify(token, "lamodaesteneruntokenentusession")
  try {

    const user = await User.findOne({ _id: decoded._id})
    console.log('HOla ', user);
    const hasPermission = userHasPermission(methodArn,user.rol)
    const allowed = hasPermission ? 'Allow' : 'Deny'
    console.log(user);
    return  generateAuthResponse('user', allowed, methodArn, user._id)

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

module.exports = authorization;