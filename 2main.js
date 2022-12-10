const MongoClient = require("mongodb").MongoClient;
const USER = require("./user");
const COMMUTER = require("./commuter");
// const BUS = require("./bus");
// const BUS_STOP = require("./bus_stop");

MongoClient.connect(
	"mongodb+srv://bolehland:bolehland@cluster0.w5dfdjn.mongodb.net/?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB for CBS_UTEM');
	USER.injectDB(client);
	COMMUTER.injectDB(client);
	// BUS.injectDB(client);
	// BUS_STOP.injectDB(client);
})

const express = require('express')
const app = express()
const port =  process.env.PORT || 3000

// User.js
app.post('/register', async (req, res) => {
	console.log("Request Body : ", req.query);
	const user = await USER.register(req.query.username, req.query.password);
	if (user != null ) {
		console.log("User Register Successfully");
		res.status(200).json({
			_id: user._id,
			username: user.username,
		})
	} else {
		console.log("Conflict with Duplicate username");
		res.status(409).json( {error : "Conflict with Duplicate username"} );
	}
})

app.post('/login',async (req, res) => {
	console.log("Request Body : ", req.query);
	const user = await USER.login(req.query.username, req.query.password);
	if (user != null) {
		console.log("Login Successfully")
		res.status(200).json({
			_id: user._id,
			username: user.username,
			token: generateAccessToken({
				_id: user._id,
				username: user.username,
			})
		})
	} else {
		console.log("Wrong password or username");
		res.status(401).json( {error : "Wrong password or username"} );
	}
})

app.get('/history', async (req, res) => {
	console.log(req.query)
	const user = await USER.history(req.query.username)
	if (user != null ) {
		console.log("Get Successfully with", user);
		res.status(200).json(user)
	} else {
		console.log("No past history");
		res.status(404).send("No past history");
	}
})

// Commuter.js
app.get('/commuter', async (req, res) => {
	console.log(req.query)
	const user = await COMMUTER.getCommuter(req.query.username)
	if (user != null ) {
		console.log("Get Successfully with", user);
		res.status(200).json(user)
	} else {
		console.log("No past history");
		res.status(404).send("No past history");
	}
})

app.post('/commuter/create', async (req, res) => {
	console.log("Request Body : ", req.query);
	const now = new Date();
	const commuter = await COMMUTER.createCommuter(req.query.commuter_id, req.query.username, req.query.from_bs_id, now);
	if (commuter != null ) {
		console.log("Create Successfully");
		res.status(200).json({
			_id: commuter._id,
			username: commuter.username,
			from_bs_id: commuter.from_bs_id,
			to_bs_id: commuter.to_bs_id,
			from_time: commuter.from_time,
			to_time: commuter.to_time
		})
	} else {
		console.log("Conflict with Duplicate commuter ID");
		res.status(409).json( {error : "Conflict with Duplicate commuter ID"} );
	}
})

app.patch('/commuter/update', async (req, res) => {
	console.log("Request Body : ", req.query);
	const now = new Date();
	const commuter = await COMMUTER.updateCommuter(req.query.commuter_id, req.query.to_bs_id, now);
	if (commuter!= null ) {
		console.log("Update Successfully");
		console.log("What is updated : " + commuter.to_bs_id, commuter.to_time);
		res.status(200).json({
			_id: commuter._id,
			from_bs_id: commuter.from_bs_id,
			to_bs_id: commuter.to_bs_id,
			from_time: commuter.from_time,
			to_time: commuter.to_time
		})
	} else {
		console.log("Commuter ID not found");
		res.status(404).json( {error : "Commuter ID not found"} );
	}
})
// Middleware Express for JWT
// app.use(verifyToken);

//***********************************************************************************************/

app.listen(port, () => {
	console.log(`Connected Bus System app is listening on port ${port}`)
})

// JSON Web Token
const jwt = require('jsonwebtoken');
const user = require("./user");
function generateAccessToken(payload) {
	return jwt.sign(payload, "bolehland", { expiresIn: '1h' }); // expires in 1 hour
}

function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) return res.sendStatus(401)

	jwt.verify(token, "bolehland", (err, user) => {
		console.log(err)
		if (err) return res.sendStatus(403)
		req.user = user
		next()
	})
} 
