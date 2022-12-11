let commuters;

class Commuter {
	static async injectDB(conn) {
		commuters = await conn.db("CBS_UTEM").collection("commuter")
	}

	static async createCommuter(commuter_id, username, from_bs_id, from_time) {
		let commuter = await commuters.findOne({ "commuter_id": commuter_id });
		if (commuter) {
			return null;
		} else {
			await commuters.insertOne({ "commuter_id": commuter_id, "username": username, "from_bs_id": from_bs_id, "from_time": from_time });
		}
		return commuter = await commuters.findOne({ "commuter_id": commuter_id });
	}

	static async updateCommuter(commuter_id, to_bs_id, to_time) {
        let commuter = await commuters.findOne({ "commuter_id": commuter_id });
        if (!commuter) {   
            return null;
        } else {
            await commuters.updateOne({ "commuter_id": commuter_id }, { $set: { "to_bs_id": to_bs_id, "to_time": to_time } });
	    }
        return commuter = await commuters.findOne({ "commuter_id": commuter_id });
    }

    static async getCommuter(username) {
        let document = await commuters.find({ "username": username }).toArray();
        //console.log(document);
		if(document.length > 0){
            return document;
        } else {
            return null;
        }
	}

}

module.exports = Commuter;
