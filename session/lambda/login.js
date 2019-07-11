const login = (event) => {
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
  console.log('arnValue: ', arnValue);
  console.log('rol: ',rol);
  if (arnValue) {
    return rol == arnValue;
  }
  return false;

}