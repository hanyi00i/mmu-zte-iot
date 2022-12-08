const MongoClient = require("mongodb").MongoClient;
const {Navigator} = require("node-navigator");

let client;
async function main(){
    const uri = "mongodb+srv://bolehland:bolehland@cluster0.w5dfdjn.mongodb.net/?retryWrites=true&w=majority"
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
}

main().catch(console.error);
var dbo = client.db("CBS_UTEM").collection("bus");
const navigator = new Navigator();
var long, lat;
navigator.geolocation.getCurrentPosition((position) => {
    lat = position.latitude;
    console.log(lat);
    long = position.longitude;
    dbo.updateOne({"bus_plate":"UTeM 9012"},{$set: {'latitude':lat, 'longitude':long}});
});
