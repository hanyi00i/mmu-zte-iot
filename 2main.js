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

app.post('/register', async (req, res) => {
	console.log("Request Body : ", req.body);
	const user = await USER.register(req.body.username, req.body.password,);
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
	console.log("Request Body : ", req.body);
	const user = await USER.login(req.body.username, req.body.password);
	if (user != null) {
		console.log("What is send to test : " + user._id, user.username);
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
	const user = await USER.history(username)
	if (user != null ) {
		console.log("Get Successfully with", user);
		res.status(200).json({user})
	} else {
		console.log("Failed to get user");
		res.status(404).send("Failed to get user");
	}
})


// Middleware Express for JWT
app.use(verifyToken);

//***********************************************************************************************/

app.listen(port, () => {
	console.log(`Connected Bus System app is listening on port ${port}`)
})

// JSON Web Token
const jwt = require('jsonwebtoken');
const USER = require("./user");
function generateAccessToken(payload) {
	return jwt.sign(payload, "bolehland", { expiresIn: '1h' }); // expires in 1 hour
}

function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) return res.sendStatus(401)

	jwt.verify(token, "group10-secret-s2", (err, user) => {
		console.log(err)
		if (err) return res.sendStatus(403)
		req.user = user
		next()
	})
} 
