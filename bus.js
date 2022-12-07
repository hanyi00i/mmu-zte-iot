let booking, bus;

// # Function to use:
// readInfo
// updateCommuterID&DepatureTime
// updateRoute

class Bus {
	static async injectDB(conn) {
        //booking = await conn.db("CBS_UTEM").collection("bus")
        bus = await conn.db("CBS_UTEM").collection("bus")
	}


    static async BookingandReservation(facilities_id, visitor_id, time_slot) {
        let i,ii;
		// TODO: Check if current booking is full
        let result = await booking.find(
            {facilities_id: facilities_id, time_slot: time_slot}).toArray();

        let facilities = await faci.find(
            {facilities_id: facilities_id}).toArray();

            console.log("Number of bookings: "+result.length+"   Maximum Number of bookings: "+facilities[0].max_no_visitors);
        if(result.length <= facilities[0].max_no_visitors){
            i = true;
            console.log("Booking is available");
        } else {
            i =  false;
            console.log("Booking is full");
        }

        // TODO: Check if duplicate booking
        let result2 = await booking.find(
            {facilities_id: facilities_id, time_slot: time_slot, visitor_id: visitor_id}).toArray();
        if(result2.length == 0){
            ii =  true;
            console.log("You may book this facility");
        } else {
            ii =  false;
            console.log("You have already booked this facility");
        }

		// TODO: Save booking request to database
        if(i && ii){
            await booking.insertOne({
                facilities_id: facilities_id,
                visitor_id: visitor_id,
                time_slot: time_slot
            })
        } else {
            return false
        };

        return booking.find({
            facilities_id: facilities_id,
            visitor_id: visitor_id,
            time_slot: time_slot
        }).toArray()
	}

    static async queryBooking(facilities_id) {
        // TODO: Query booking request
        let result = await booking.find({facilities_id: facilities_id}).toArray();
        if(result.length > 0){
            console.log("Booking request found");
            return result;
        } else {
            return null;
        }
    }
}



module.exports = Bus;

