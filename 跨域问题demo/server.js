var express = require('express')
var proxy = require('express-http-proxy'); 
var app1 = express()
app1.get('/test' , (req , res) => {
	// 1、 CORS 方法	修改响应头
	// res.header('Access-Control-Allow-Origin' , '*')
	res.send('你好91')


	// 2、 jsonp
	// var back = req.query.callback
	// res.send(`${back}('你好91')`)
})
app1.listen(90)


var app2 = express()
app2.use(express.static(__dirname))
app2.listen(91)
app2.use('/api',proxy('http://localhost:90'))