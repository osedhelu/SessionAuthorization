exports.login = async (event, context) => {
     try {
        const loginParams = JSON.parse(event.body);
        const resp = customLogin(loginParams)

        }catch (err) {
        console.log(err);
        return err;
    }

    return res
}
const customLogin = (params)=>{
    

}




exports.login = async (event, context) => {
     try {

        const newUsers = JSON.parse(event.body);
        const user = await User.findByCredentials(newUsers.user, newUsers.password);
        const rol = user.rol
        const userName = user.user
        const  token = await user.generateAuthToken()
        res = {
            'statusCode': 200,
            'body': JSON.stringify({
                rol,
                userName,
                token:{
                    token   
                }
            }),
            headers: {}
        }
        }
 catch (err) {
        console.log(err);
        return err;
    }

    return res
}