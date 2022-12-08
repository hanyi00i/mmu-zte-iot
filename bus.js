let bus;

class Bus {
	static async injectDB(conn) {
        bus = await conn.db("CBS_UTEM").collection("bus")
	}

    // read from_bs_id to the to_bs_id (search bus available)
    static async searchBus(from_bs_id, to_bs_id) {
        let search = await bus.find({ "from_bs_id": from_bs_id, "to_bs_id": to_bs_id })
        if (!search) {
            return null;
        } else {
            return search;
        }
    }

    // update depature time (manually input by driver with matched bus_plate)
    static async updateDepartureTime(bus_plate, departure_time) {
        let document = await bus.find({ "bus_plate": bus_plate }, {$set : {"departure_time": departure_time} })
        if (!document) {
            return "update failed";
        } else {
            return "update success";
        }
    }

    // update number of commuter
    static async updateCommuterNum(bus_plate, commuter_num) {
        let document = await bus.find({ "bus_plate": bus_plate }, {$set : {"number": commuter_num} })
        if (!document) {
            return "update failed";
        } else {
            return "update success";
        }
    }

}

module.exports = Bus;

