let busstop;

class BusStop {
	static async injectDB(conn) {
        busstop = await conn.db("CBS_UTEM").collection("bus_stop")
	}

    // read bs_id (retreive bus stop information)
	static async readInfo(area) {
        let document = await busstop.findAll({"area": {$regex: area, $options: "i"}});
        if (!document) {
            return null;
        } else {
            return document;
        }
	}

    // update number of people waiting (with AI camera perhaps with matched bs_id?)
    static async updateOne(bs_id, waiting) {
        let document = await busstop.find({ "bs_id": bs_id })
        if (!document) {
            return null;
        } else {
            let output = await busstop.updateOne({ "bs_id": bs_id }, { $set: { "waiting": waiting } })
            return output;
        }
    }
}

module.exports = BusStop;