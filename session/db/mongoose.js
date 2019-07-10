const mongoose = require("mongoose");
// const tableDB = "test"

mongoose.connect(`mongodb+srv://danielapps:danielapps@cluster0-mpguq.mongodb.net/test?retryWrites=true&w=majority`, {
        useNewUrlParser:true,
        useCreateIndex:true
    }, (err) => {
        console.log("error conection", err);
    });
console.log(mongoose.connection.readyState);