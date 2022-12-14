let busstop;

class BusStop {
	static async injectDB(conn) {
        busstop = await conn.db("CBS_UTEM").collection("bus_stop")
	}

    // read bs_id (retreive bus stop information)
	static async searchBusStop(area) {
        let document = await busstop.find({"area": area}).toArray();
        if (!document[0]) {
            return null;
        } else {
            return document;
        }
	}

    // read all bus stop
    static async searchAll() {
        let document = await busstop.find({}).toArray();
        if (!document[0]) {
            return null;
        } else {
            return document;
        }
    }

    // fetch bus location (with matched bus_plate)
    static async fetchLocation(bs_id) {
        let search = await busstop.find({ "bs_id": bs_id }).toArray();
        if (!search[0]) {
            return null;
        } else {
            return await busstop.find({ "bs_id": bs_id }).project({bs_id: 1, longitude: 1, latitude: 1, _id: 0}).toArray();
        }
    }

    // update number of people waiting (with AI camera perhaps with matched bs_id?)
    static async updateWaiting(bs_id, waiting, image) {
        await busstop.updateOne({ "bs_id": bs_id }, { $set: { "waiting": waiting, "image":image }})
        let document = await busstop.find({ "bs_id": bs_id}).toArray();
        if (document.length == 0) {
            return null;
        } else {
            let output = await busstop.find({ "bs_id": bs_id }).project({_id: 0}).toArray();
            return output;
        }
    }
}

module.exports = BusStop;