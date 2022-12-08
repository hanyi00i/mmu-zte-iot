const MongoClient = require("mongodb").MongoClient;
const USER = require("./user");
const COMMUTER = require("./commuter");
const BUS = require("./bus");
const BUS_STOP = require("./bus_stop");

MongoClient.connect(
	"mongodb+srv://bolehland:<password>@cluster0.w5dfdjn.mongodb.net/?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	// USER&&COMMUTER&&BUS&&BUS_STOP.injectDB(client);
	USER.injectDB(client);
	COMMUTER.injectDB(client);
	BUS.injectDB(client);
	BUS_STOP.injectDB(client);
})


const express = require('express')
const app = express()
const port =  process.env.PORT || 3000

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

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
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.send('Welcome To Connected Bus System API')
})

/**
 * @swagger
 * components:
 *   schemas:
 *     user:
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *     visitor:
 *       properties:
 *         name:
 *           type: string
 *         ic_no:
 *           type: string
 *         hp:
 *           type: string
 *     facilities:
 *        properties:
 *          facilityes_id:
 *           type: string
 *          name:
 *           type: string
 *          location:
 *           type: string
 *          operatin_hours:
 *           type: string
 *          max_number_visitors:
 *           type: int
 *          manager_id:
 *           type: string   
 *     booking_request:
 *        properties:
 *          facilities_id:
 *           type: string
 *          visitor_id:
 *           type: string
 *          time_slot:
 *           type: string
 *  
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /login:
 *   post:
 *     tags : ["Client"]
 *     description: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Login Successful!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       401:
 *         description: Invalid username or password
 */

app.post('/login', async (req, res) => {
	console.log(req.body);

	const user = await user.login(req.body.username, req.body.password);
	if (user != null) {
		console.log("Login Successful!");
		res.status(200).json({
			_id: user[0]._id,
			username: user[0].username,
			token: generateAccessToken({
				_id: user[0]._id,
				username: user[0].username,
				role: user[0].role
			}),
			role: user[0].role
		})
	} else {
		console.log("Login failed")
		res.status(401).send("Invalid username or password");
		return
	}
})


/**
 * @swagger
 * /facilities/{name}:
 *   get:
 *     tags : ["Client"]
 *     description: Search facility
 *     parameters:
 *       - in: path
 *         name: name 
 *         schema: 
 *           type: string
 *         required: true
 *         description: facility name
 *     responses:
 *       200:
 *         description: Facility found!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/facilities'
 *       404:
 *         description: No facility found
 */

app.get('/facilities/:name', async (req, res) => {
	console.log(req.params);
	const facilities = await BUS.getFacilities(req.params.name);
	if (facilities != null) {
		console.log("Facility found!");
		res.status(200).json(facilities);
	} else {
		console.log("Get Facilities failed")
		res.status(404).send("No Facilities found");
	}
})

/**
 * @swagger
 * /queryBooking/{id}:
 *   get:
 *     tags : ["Client"] 
 *     description: Search Booking
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: facility id
 *     responses:
 *       200:
 *         description: Booking found!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/booking_request'
 *       404:
 *         description: Booking not found
 */

 app.get('/queryBooking/:id', async (req, res) => {
	console.log(req.params);
	const booking = await BUS_STOP.queryBooking(req.params.id);
	if (booking != null) {
		console.log("Booking found!");
		res.status(200).json(booking);
	} else {
		console.log("Booking not found")
		res.status(404).send("Booking not found");
	}
})


// Middleware Express for JWT
app.use(verifyToken);


/**
 * @swagger
 * /register:
 *   post:
 *     tags : ["Admin"] 
 *     security: 
 *       - bearerAuth: []
 *     description: User Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *               role: 
 *                 type: string
 *                 enum: [admin, user]
 *                 required: true
 *     responses:
 *       200:
 *         description: Register successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       409:
 *         description: Register failed
 *       403:
 *         description: Forbidden
 */

 app.post('/register', async (req, res) => {
	console.log(req.body);
	if(req.user.role == "admin") {
		const user = await user.register(req.body.username, req.body.password, req.body.role);
		if (user != null) {
			console.log("Register successful");
			res.status(200).send("User registered");
		} else {
			console.log("Register failed")
			res.status(409).json("Username already exists");
		}
	} else {
		res.status(403).send('Forbidden')
	}
})

/**
 * @swagger
 * /updateFacility:
 *   patch:
 *     tags : ["Facility Manager"]
 *     security: 
 *       - bearerAuth: []
 *     description: Update Facility Info
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               facilities_id: 
 *                 type: string
 *               name: 
 *                 type: string
 *               location: 
 *                 type: string
 *               operating_hours: 
 *                 type: string
 *               max_number_visitors: 
 *                 type: string
 *               manager_id: 
 *                 type: string
 * 
 *     responses:
 *       200:
 *         description: Update Facility Successful!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/facilities'
 *       404:
 *         description: Facility not found
 *       401:
 *         description: Unauthorized
 */

app.patch('/updateFacility', async (req, res) => {
	console.log(req.body);
	if(req.user.role = "user"){
		const facility = await BUS.updateFacility(req.body.facilities_id, req.body.name, req.body.location, req.body.operating_hours, req.body.max_number_visitors, req.body.manager_id);
		if (facility != null) {
			console.log("Update Facility Successful!");
			res.status(200).json(facility);
		} else {
			console.log("Update Facility failed")
			res.status(404).send("Facility not found");
		}
	} else {
		res.status(401).send("Unauthorized");
	}
})

/**
 * @swagger
 * /createVisitor:
 *   post:
 *     tags : ["Facility Manager"]
 *     security: 
 *       - bearerAuth: []
 *     description: Create Visitor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               name: 
 *                 type: string
 *               ic_no: 
 *                 type: string
 *               hp: 
 *                 type: string
 * 
 *     responses:
 *       200:
 *         description: Visitor created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/visitor'
 *       409:
 *         description: Visitor already exists
 *       401:
 *         description: Unauthorized
 */

app.post('/createVisitor', async (req, res) => {
	console.log(req.body);
	if(req.user.role == 'user') {
		const visitor = await COMMUTER.create_visitor(req.body.name, req.body.ic_no, req.body.hp);
		if (visitor != false) {
			console.log("Visitor created");
			res.status(200).send("Visitor created");
		} else {
			console.log("Visitor creation failed")
			res.status(409).json("Visitor already exists");
		}
	} else {
		res.status(401).send("Unauthorized");
	}
})

/**
 * @swagger
 * /BookingandReservation:
 *   post:
 *     tags : ["Facility Manager"]
 *     security: 
 *       - bearerAuth: []
 *     description: Booking and Reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               facility_id: 
 *                 type: string
 *               visitor_id: 
 *                 type: string
 *               time_slot: 
 *                 type: string
 * 
 *     responses:
 *       200:
 *         description: Booking and Reservation Successful!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/booking_request'
 *       424:
 *         description: Booking and Reservation Failed!
 *       401:
 *         description: Unauthorized
 *       
 */

app.post('/BookingandReservation', async (req, res) => {
	console.log(req.body);
	if(req.user.role == 'user') {
		const booking = await BUS_STOP.BookingandReservation(req.body.facility_id, req.body.visitor_id, req.body.time_slot);
		if (booking != false) {
			console.log("Booking and Reservation Successful!");
			res.status(200).json(booking);
		} else {
			console.log("Booking and Reservation failed")
			res.status(424).send("Booking and Reservation failed");
		} 
	} else {
		res.status(401).send("Unauthorized");
	}
})

/**
 * @swagger
 * /createFacility:
 *   post:
 *     tags : ["Admin"]
 *     security: 
 *       - bearerAuth: []
 *     description: Create Facility
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               facilities_id: 
 *                 type: string
 *               name: 
 *                 type: string
 *               location: 
 *                 type: string
 *               operating_hours: 
 *                 type: string
 *               max_number_visitors: 
 *                 type: string
 *               manager_id: 
 *                 type: string
 * 
 *     responses:
 *       200:
 *         description: Facility created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/facilities'
 *       409:
 *         description: Facility already exists
 *       403:
 *         description: Forbidden
 */

 app.post('/createFacility', async (req, res) => {
	console.log(req.body);
	if(req.user.role == "admin") {
		const facility = await BUS.createFacility(req.body);
		if (facility != null) {
			console.log("Facility created");
			res.status(200).json(facility);
		} else {
			console.log("Facility creation failed")
			res.status(404).send("Facility already exists");
		}
	} else {
		res.status(403).send('Forbidden')
	}
})

/**
 * @swagger
 * /visitor/{id}:
 *   get:
 *     tags : ["Facility Manager"] 
 *     security: 
 *       - bearerAuth: []
 *     description: Get visitor by id
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: Visitor id
 *     responses:
 *       200:
 *         description: Visitor found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/visitor'
 *       404:
 *         description: Query not found
 *       401:
 *         description: Unauthorized
 */

app.get('/visitor/:id', async (req, res) => {
	console.log(req.user);
	console.log(req.params);

	if(req.user.role == 'user') {
		let visitor = await COMMUTER.getVisitor(req.params.id);

		if (visitor)
			res.status(200).json(visitor)
		else
			res.status(404).send("Invalid Visitor Id");
	} else {
		res.status(401).send('Unauthorized')
	}
})

/**
 * @swagger
 * /deleteFacility/{id}:
 *   delete:
 *     tags : ["Admin"] 
 *     security: 
 *       - bearerAuth: []
 *     description: Delete Facility
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: facility id
 *     responses:
 *       200:
 *         description: Facility deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/facilities'
 *       404:
 *         description: Facility not found
 *       403:
 *         description: Forbidden
 */

 app.delete('/deleteFacility/:id', async (req, res) => {

	if(req.user.role == 'admin') {
		const facility = await BUS.deleteFacility(req.params.id);
		if (facility != false) {
			console.log("Delete Facility Successful!");
			res.status(200).send("Facility deleted");
		} else {
			console.log("Delete Facility failed")
			res.status(404).send("Facility not found");
		}
	} else {
		res.status(403).send('Forbidden')
	}
 })	



app.listen(port, () => {
	console.log(`FMS REST API listening on port ${port}`)
})


const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
	return jwt.sign(payload, "Assignment-S2G13", { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) return res.sendStatus(401)

	jwt.verify(token, "Assignment-S2G13", (err, user) => {
		console.log(err)

		if (err) return res.sendStatus(403)

		req.user = user

		next()
	})
}
