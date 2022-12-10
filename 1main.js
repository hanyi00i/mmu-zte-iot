const MongoClient = require("mongodb").MongoClient;
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
	BUS.injectDB(client);
	BUS_STOP.injectDB(client);
})

const express = require('express');
const app = express()
const port =  process.env.PORT || 3000

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

app.get('/search/bus/', async (req, res) => {
	console.log("1. Request Body : " + req.query.from_bs_id + " " + req.query.to_bs_id);
	let bus = await BUS.searchBus(req.query.from_bs_id, req.query.to_bs_id);
	if (bus != null) {
		console.log("5. Respon sent to frontend, check your browser");
		res.status(200).json(bus);
	} else {
		console.log("5. Bus trip not found")
		res.status(404).send("Bus trip not found");
	}
})

app.get('/getlocation/', async (req, res) => {
	console.log("1. Request Body : ",req.query);
	if (req.query.bs_id) {
		let busstop = await BUS_STOP.fetchLocation(req.query.bs_id);
		if (busstop != null) {
			console.log("5. Respon sent to frontend, check your browser");
			res.status(200).json(busstop);
		} else {
			console.log("5. Bus stop location not found")
			res.status(404).send("Bus stop location not found");
		}
	} else if (req.query.bus_plate) {
		let bus = await BUS.fetchLocation(req.query.bus_plate);
		if (bus != null) {
			console.log("5. Respon sent to frontend, check your browser");
			res.status(200).json(bus);
		} else {
			console.log("5. Bus trip not found")
			res.status(404).send("Bus trip not found");
		}
	}	
})

app.patch('/update/DepartTime/', async (req, res) => {

	console.log("1. Request Body : " + req.query.bus_plate, req.query.hour, req.query.minute);
	let bus = await BUS.updateDepartureTime(req.query.bus_plate,req.query.hour,req.query.minute);
	if (bus != null) {
		console.log("5. Respon sent to frontend, check your browser");
		res.status(200).json(bus);
	} else {
		console.log("5. Depature Time update failed")
		res.status(404).send("Depature Time update failed");
	}
})

app.patch('/update/bus-Commuter', async(req, res) => {
	console.log("1. Request Body : " , req.query);
	let bus = await BUS.updateCommuterNum(req.query.bus_plate, req.query.commuter_num);
	if (bus != null) {
		console.log("5. Commuter number of "+ req.query.bus_plate + " update to " + req.query.commuter_num);
		res.status(200).json(bus);
	} else {
		console.log("5. Commuter number update failed")
		res.status(404).send("Commuter number update failed");
	}
})

//BUS_STOP FUNCTION

app.get('/search/bus-stop/', async(req, res) => {
	console.log("1. Request Body : " , req.query);
	let bs = await BUS_STOP.searchBusStop(req.query.area);
	if (bs != null) {
		console.log("5. Related bus stop found : " + bs);
		res.status(200).json(bs);
	} else {
		console.log("5. Bus stop not found")
		res.status(404).send("Bus stop not found");
	}
})

app.patch('/update/waiting/', async(req, res) => {
	console.log("1. Request Body : " + req.query);
	let bs = await BUS_STOP.updateWaiting(req.query.bs_id, req.query.waiting);
	if (bs != null) {
		console.log("5. User number of "+ req.query.bs_id + " update to " + req.query.waiting);
		res.status(200).json(bs);
	} else {
		console.log("5. User number update failed")
		res.status(404).send("User number update failed");
	}
})

app.listen(port, () => {
	console.log(`CBS REST API listening on port ${port}`)
})
