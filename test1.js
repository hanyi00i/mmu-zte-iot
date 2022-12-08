const MongoClient = require("mongodb").MongoClient;
const { Navigator } = require("node-navigator");

MongoClient.connect(
  "mongodb+srv://bolehland:bolehland@cluster0.w5dfdjn.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true },
   (err, db) => {
    if (err) throw err;
    var dbo = db.db("CBS_UTEM").collection("bus");
    const navigator = new Navigator();
    let long, lat;
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.latitude;
      long = position.longitude;
    });
    dbo.insertOne({ "testing": lat });
  }
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
});
