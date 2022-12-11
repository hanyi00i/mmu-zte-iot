
let bus;

class Bus {
	static async injectDB(conn) {
        bus = await conn.db("CBS_UTEM").collection("bus")
	}

    // read from_bs_id to the to_bs_id (search bus available)
    static async searchBus(from_bs_id, to_bs_id) {
        console.log("2. from_bs_id : " + from_bs_id + " to_bs_id : " + to_bs_id)
        let search = await bus.find({ "from_bs_id": from_bs_id, "to_bs_id": to_bs_id }).toArray();
        console.log("3. " + search);
        if (!search[0]) {
            console.log("4. Search Failed")
            return null;
        } else {
            console.log("4. Search Success");
            return search[0];
        }
    }

    // update depature time (manually input by driver with matched bus_plate)
    static async updateDepartureTime(bus_plate, hour, minute) {
        console.log("2. bus_plate : " + bus_plate + " hour : " + hour, " minute : " + minute)
        let departure_time = new Date();   
        departure_time.setHours(hour)
        departure_time.setMinutes(minute);
        departure_time.setSeconds(0);
        console.log("2.1 " + departure_time);
        
        await bus.updateOne({ "bus_plate": bus_plate }, {$set : {"departure_time": departure_time} })
        let document = await bus.find({ "bus_plate": bus_plate }).toArray();
        console.log("3. " + document[0].departure_time);
        
        if (document[0] = null) {
            console.log("4. Update Failed")
            return null;
        } else {
            console.log("4. Update Success");
            return await bus.find({ "bus_plate": bus_plate,}).project({bus_plate: 1, departure_time: 1, _id: 0}).toArray();
        }
    }

    // update number of commuter
    static async updateCommuterNum(bus_plate, commuter_num) {
        console.log("2. bus_plate : " + bus_plate + " commuter_num : " + commuter_num)
        await bus.updateOne({ "bus_plate": bus_plate }, {$set : {"number": commuter_num}})
        let document = await bus.find({ "bus_plate": bus_plate}).toArray();
        console.log("3. " + document[0].number);
        if (!document[0]) {
            console.log("4. Update Failed")
            return null;
        } else {
            console.log("4. Update Success");
            return await bus.find({ "bus_plate": bus_plate}).project({bus_plate: 1, number: 1, _id: 0}).toArray();
        }
    }

    // fetch bus location (with matched bus_plate)
    static async fetchLocation(bus_plate) {
        console.log("2. bus_plate : " + bus_plate)
        let search = await bus.find({ "bus_plate": bus_plate }).toArray();
        console.log("3. " + search[0]);
        if (!search[0]) {
            console.log("4. Search Failed")
            return null;
        } else {
            console.log("4. Search Success");
            return await bus.find({ "bus_plate": bus_plate }).project({bus_plate: 1, from_bs_id: 1, to_bs_id: 1, longitude: 1, latitude: 1, _id: 0}).toArray();
            // return [search[0].latitude, search[0].longitude]
        }
    }
}

module.exports = Bus;
