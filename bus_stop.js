let busstop;

// # Function to use:
// readInfo
// updateCheckinID

class BusStop {
	static async injectDB(conn) {
        busstop = await conn.db("CBS_UTEM").collection("bus_stop")
	}

    // static async createBusStop(param) {
	// 	console.log(param);
	// 	let document = await busstop.find({ facilities_id: param.facilities_id }).toArray()
    //     console.log(facilities)
    //         if (facilities.length > 0) {
    //             return false;
    //         } else {
    //             let output = await faci.insertOne({ 
    //                 facilities_id: param.facilities_id, 
    //                 name: param.name, 
    //                 location: param.location, 
    //                 operating_hours: param.operating_hours, 
    //                 max_number_visitors: param.max_number_visitors, 
    //                 manager_id: param.manager_id 
    //             })
    //             console.log('Facility info created:'+ output)
    //             return faci.find({ facilities_id: param.facilities_id }).toArray()
    //         }
	// }

	static async readInfo(area) {
		// TODO: Find bus stop
        let document = await busstop.findAll({"area": {$regex: area, $options: "i"}});
        if (!document) {
            return null;
        } else {
            return document;
        }
	}

    static async updateCheckinID(bs_id, temp_checkin_id) {
        // TODO: Update number of visitors
        let document = await busstop.find({ "and": [{ "bs_id": bs_id }, { "temp_checkin_id": temp_checkin_id }] })
        if (!document) {
            return null;
        } else {
            let output = await busstop.updateOne({ "bs_id": bs_id }, { $set: { "temp_checkin_id": temp_checkin_id } })
            return true;
        }
    }

    static async deleteFacility(facilities_id) {
        let facilities = await faci.find({ facilities_id: facilities_id }).toArray();
        if (facilities.length == 0) {
            return false;
        }
        else {
            let output = await faci.deleteOne({ facilities_id: facilities_id })
            console.log[output, "deleted"]
            return true;
        }
    }
}

module.exports = BusStop;