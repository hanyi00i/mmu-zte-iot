const bcrypt = require("bcrypt");

let users;
class User {
	static async injectDB(conn) {
		users = await conn.db("CBS_UTEM").collection("user")
	}

	static async register(username, password) {
		// TODO: Check if username exists
	    let user = await users.findOne({ "username": username });
		if (user) {
			return null;
		} else {
		// TODO: Hash password
        const hashpassword = await bcrypt.hash(password, 10);
		// TODO: Save user to database
        await users.insertOne({"username": username, "password": hashpassword});
		}
		return user = await users.findOne({ "username": username });
	}

	static async login(username, password) {
		// TODO: Check if username exists
		let user = await users.findOne({ "username": username });
		if (!user) {
			return null;
		}
		// TODO: Validate password
		const match = await bcrypt.compare(password, user.password); 
		if (!match) {
			return null;
		}
		// TODO: Return user object
		return user;
	}

	static async history(username) {
        let user = await users.findOne({ "username": username});
        if (user) {
            return users.aggregate([
				{$match: {username: username}},
                {$lookup:{
                    from:"commuter",
                    localField:"username",
                    foreignField:"username",
                    as: "history"
                }},
				{$project:{ password: 0 }}
            ]).toArray();
        } else {
            return null
        }
	}
}

module.exports = User;
