#1 bus.js
read from_bs_id to the to_bs_id (search bus available)
update current location (from location.js insert geolocation)
update depature time (manually input by driver)
update number of commuter (with AI camera perhaps?)

#2 location.js
get geolocation and export to bus.js

#3 bus_stop.js
read bs_id (retreive bus stop information)
update number of people waiting (with AI camera perhaps?)

#4 commuter.js
insert user_id (pending)
insert bs_id (with geolocation) and time (start)
insert bs_id (with geolocation) and time (end)

#user.js
register user (hash)
login user (hash)
read past_travel_id (left join from commuter.js of the user_id) 