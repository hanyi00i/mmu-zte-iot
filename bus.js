let booking, bus;

// # Function to use:
// readInfo
// updateCommuterID&DepatureTime
// updateRoute
const {location} = require('./location.js');

class Bus {
	static async injectDB(conn) {
        //booking = await conn.db("CBS_UTEM").collection("bus")
        bus = await conn.db("CBS_UTEM").collection("bus")
	}

    static async updateLocation(bs_id) {
        // TODO: Update number of visitors
        let document = await busstop.find({ "and": [{ "bs_id": bs_id }, { "temp_checkin_id": temp_checkin_id }] })
        if (!document) {
            return null;
        } else {
            let output = await busstop.updateOne({ "bs_id": bs_id }, { $set: { "temp_checkin_id": temp_checkin_id } })
            return true;
        }
    }


    static async 

}


module.exports = Bus;

