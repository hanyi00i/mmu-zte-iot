let commuters;

// # Function to use:
// createCommuter
// updateToTime&ToBSID

class Commuter {
	static async injectDB(conn) {
		commuters = await conn.db("CBS_UTEM").collection("commuter")
	}

    static async getCommuter(id) {
        let document = await commuters.findOne({ _id: id });
        //console.log(document);
		if(document.length > 0){
            return commuters;
        } else {
            return null;
        }
	}

    static async createCommuter(from_bs_id, to_bs_id, from_time) {
		// TODO: Check if commuter already exists
        id = new ObjectId();
        let document = this.getCommuter(id);
        if(document != null){
            return null; // commuter already exists
        } else {
        // TODO: Save new commuter to database
            await commuters.insertOne({
                from_bs_id: from_bs_id,
                to_bs_id: to_bs_id,
                from_time: from_time,
            })
            //return visitors.find({ic_no: ic_no}).toArray()
        }
	}

    static async deleteCommuter(id) {
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

module.exports = Commuter;