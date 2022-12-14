let bus;

class Bus {
	static async injectDB(conn) {
        bus = await conn.db("CBS_UTEM").collection("bus")
	}

    // read from_bs_id to the to_bs_id (search bus available)
    static async searchBus(from_bs_id, to_bs_id) {
        let search = await bus.find({ "from_bs_id": from_bs_id, "to_bs_id": to_bs_id }).toArray();
        if (!search[0]) {
            return null;
        } else {
            return search[0];
        }
    }

    // read all bus
    static async searchALL() {
        let search = await bus.find({ }).toArray();
        if (search.length != 0) {
            return search;
        } else {
            return null;
        }
    }

    // fetch bus location (with matched bus_plate)
    static async fetchLocation(bus_plate) {
        let search = await bus.find({ "bus_plate": bus_plate }).toArray();
        if (!search[0]) {
            return null;
        } else {
            return await bus.find({ "bus_plate": bus_plate }).project({bus_plate: 1, from_bs_id: 1, to_bs_id: 1, longitude: 1, latitude: 1, _id: 0}).toArray();
        }
    }

    // update depature time (manually input by driver with matched bus_plate)
    static async updateDepartureTime(bus_plate, hour, minute) {
        let departure_time = new Date();   
        departure_time.setHours(hour)
        departure_time.setMinutes(minute);
        departure_time.setSeconds(0);
        
        await bus.updateOne({ "bus_plate": bus_plate }, {$set : {"departure_time": departure_time} })
        let document = await bus.find({ "bus_plate": bus_plate }).toArray();
        
        if (document.length == 0) {
            return null;
        } else {
            return await bus.find({ "bus_plate": bus_plate,}).project({bus_plate: 1, departure_time: 1, _id: 0}).toArray();
        }
    }

    // update number of commuter
    static async updateCommuterNum(bus_plate, commuter_num) {
        await bus.updateOne({ "bus_plate": bus_plate }, {$set : {"number": commuter_num}})
        let document = await bus.find({ "bus_plate": bus_plate}).toArray();
        if (document.length == 0) {
            return null;
        } else {
            return await bus.find({ "bus_plate": bus_plate}).project({bus_plate: 1, number: 1, _id: 0}).toArray();
        }
    }
}

module.exports = Bus;