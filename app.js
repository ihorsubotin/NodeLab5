const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
   
const app = express();
const jsonParser = express.json();
 
const {
    MONGO_DB_HOSTNAME,
    MONGO_DB_PORT,
    MONGO_DB
} = process.env

const url = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;

const orderSchema = new Schema({
	productName: String,
	price: { type: Number, min: 0},
	time: { type: Date, default: Date.now },
	customerName: String,
	customerPhone: {type: String, maxlength:13}	
}, {versionKey: false});

const Order = mongoose.model("Order", orderSchema);
  
app.use(express.static(__dirname + "/public"));

mongoose.connect(url, { 
	useUnifiedTopology: true, 
	useNewUrlParser: true 
}).then(function(client){
    app.listen(3000, function(){
        console.log("Сервер очікує підключения...");
    });
}).catch(function (err){
	if(err) return console.log(err);
});
 
app.get("/api/orders", function(req, res){	
	Order.find({}).then(function(orders){
        res.send(orders)
    }).catch(function (err){
		if(err) return console.log(err);
	});
     
});
app.get("/api/orders/:id", function(req, res){
        
    const id = req.params.id;
    Order.findOne({_id: id}).then(function(order){
        res.send(order);
    }).catch(function (err){
		if(err) return console.log(err);
	});
});
   
app.post("/api/orders", jsonParser, function (req, res) {
       
    if(!req.body) return res.sendStatus(400);
       
    const orderProductName = req.body.productName;
	const orderPrice = req.body.price;
	const orderTime = req.body.time;
    const orderCustomerName = req.body.customerName;
	const orderCustomerPhone = req.body.customerPhone;
    const order = new Order({
		productName: orderProductName,
		price: orderPrice,
		customerName: orderCustomerName,
		customerPhone: orderCustomerPhone	
	});
	if(orderTime != ""){
		order.time = orderTime;
	}
	
	order.save().then(function(result){
		order._id = result.insertedId;
        res.send(order);
	}).catch(function(err){
		return console.log(err);
	});
});
    
app.delete("/api/orders/:id", function(req, res){
        
    const id = req.params.id;
    Order.findByIdAndDelete(id).then(function(order){
        res.send(order);
	}).catch(function(err){
		return console.log(err);   
	});
});
   
app.put("/api/orders", jsonParser, function(req, res){
        
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const orderProductName = req.body.productName;
	const orderPrice = req.body.price;
	const orderTime = req.body.time;
    const orderCustomerName = req.body.customerName;
	const orderCustomerPhone = req.body.customerPhone;
    const order = {
		productName: orderProductName,
		price: orderPrice,
		customerName: orderCustomerName,
		customerPhone: orderCustomerPhone	
	};
	if(orderTime != ""){
		order.time = orderTime;
	}
       
    Order.findOneAndUpdate({_id: id}, order, {new: true}).then(function(order){
		res.send(order);
	}).catch(function (err){
		return console.log(err);
	});
});
