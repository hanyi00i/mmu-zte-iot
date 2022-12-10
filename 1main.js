const MongoClient = require("mongodb").MongoClient;
// const USER = require("./user");
// const COMMUTER = require("./commuter");
const BUS = require("./bus");
const BUS_STOP = require("./bus_stop");

MongoClient.connect(
	"mongodb+srv://bolehland:bolehland@cluster0.w5dfdjn.mongodb.net/?retryWrites=true&w=majority",
	{ useNewUrlParser: true, useUnifiedTopology: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	// USER.injectDB(client);
	// COMMUTER.injectDB(client);
	BUS.injectDB(client);
	BUS_STOP.injectDB(client);
})

// var bodyParser = require('body-parser')  //testing
const express = require('express');
// const { json } = require("body-parser");
const app = express()
const port =  process.env.PORT || 3000

// const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Connected Bus System API',
			version: '1.0.0',
		},
		securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                scheme: 'bearer',
                in: 'header',
			},
		}
	},
	apis: ['./main.js'],
};

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(bodyParser.json({ extended: true }));

// app.get('/', (req, res) => {
// 	res.send('Welcome To Connected Bus System API')
// })

app.get('/search/bus/', async (req, res) => {
	console.log("1. Request Body : " + req.query.from_bs_id + " " + req.query.to_bs_id);
	let bus = await BUS.searchBus(req.query.from_bs_id, req.query.to_bs_id);
	if (bus!= null) {
		console.log("Info sending to frontend : " + bus);
		res.status(200).json(bus);
	} else {
		console.log("Bus trip not found")
		res.status(404).send("Bus trip not found");
	}
})

app.patch('/update/DepartTime/', async (req, res) => {
	console.log("Request Body : ",req.body);
	const bus = await BUS.updateDepartureTime(req.body.bus_plate,req.body.departure_time);
	if (bus != null) {
		console.log("Info sending to database : " + bus);
		res.status(200).json(bus);
	} else {
		console.log("update failed")
		res.status(404).send("Depature Time update failed");
	}
})

app.patch('/update/bus-Commuter', async(req, res) => {
	console.log("Request Body : ",req.body);
	const bus = await BUS.updateCommuterNum(req.body.bus_plate, req.body.commuter_num);
	if (bus != null) {
		console.log("Info sending to database : " + bus);
		res.status(200).json(bus);
	} else {
		console.log("Commuter number for "+ req.body.bus_plate + "update successfully")
		res.status(404).send("Commuter number update successfully");
	}
})

app.get('/search/bus-stop/:area', async(req, res) => {
	console.log("Request Body : ",req.body);
	const bs = await BUS_STOP.readInfo(req.body.area);
	if (bs != null) {
		console.log("Info sending to frontend : " + bs);
		res.status(200).json(bs);
	} else {
		console.log("Bus stop not found")
		res.status(404).send("Bus stop not found");
	}
})

app.patch('/update/bus-stop-User', async(req, res) => {
	console.log("Request Body : ",req.body);
	const bs = await BUS_STOP.updateUserNum(req.body.bus_stop_id, req.body.user_num);
	if (bs != null) {
		console.log("Info sending to database : " + bs);
		res.status(200).json(bs);
	} else {
		console.log("User number for "+ req.body.bus_stop_id + "update successfully")
		res.status(404).send("User number update successfully");
	}
})

app.listen(port, () => {
	console.log(`CBS REST API listening on port ${port}`)
})



