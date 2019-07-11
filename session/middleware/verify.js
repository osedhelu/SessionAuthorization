const veridicaRol = (event, context, next) => {
	console.log("hola soy un middleware");
	
	next()
}

module.exports = veridicaRol