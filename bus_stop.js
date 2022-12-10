let busstop;

class BusStop {
	static async injectDB(conn) {
        busstop = await conn.db("CBS_UTEM").collection("bus_stop")
	}

    // read bs_id (retreive bus stop information)
	static async searchBusStop(area) {
        console.log("2. area : " + area);
        let document = await busstop.find({"area": area}).toArray();
        console.log("3. " + document[0].area);
        if (!document[0]) {
            console.log("4. Search Failed")
            return null;
        } else {
            console.log("4. Search Success");
            return document;
        }
	}

    // update number of people waiting (with AI camera perhaps with matched bs_id?)
    static async updateWaiting(bs_id, waiting) {
        console.log("2. bs_id : " + bs_id + " waiting : " + waiting)
        await busstop.updateOne({ "bs_id": bs_id }, { $set: { "waiting": waiting }})
        let document = await busstop.find({ "bs_id": bs_id}).toArray();
        console.log("3. " + document[0].waiting);
        if (!document[0]) {
            console.log("4. Update Failed")
            return null;
        } else {
            console.log("4. Update Success");
            let output = await busstop.find({ "bs_id": bs_id }).project({bs_id: 1, waiting: 1, _id: 0}).toArray();
            return output;
        }
    }

	
    static async fetchLocation(bs_id) {
        console.log("2. bs_id : " + bs_id)
        let search = await busstop.find({ "bs_id": bs_id }).toArray();
        console.log("3. " + search[0]);
        if (!search[0]) {
            console.log("4. Search Failed")
            return null;
        } else {
            console.log("4. Search Success");
            let result = await busstop.find({ "bs_id": bs_id }).project({bs_id: 1, longitude: 1, latitude: 1, _id: 0}).toArray();
            return result[0];
        }
    }
}





module.exports = BusStop;
