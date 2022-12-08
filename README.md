#1 bus.js<br />
read from_bs_id to the to_bs_id (search bus available)<br />
update depature time (manually input by driver with matched bus_plate) <br />
update number of commuter (with AI camera perhaps with matched bus_plate?)<br />

#2 location.js<br />
get geolocation and update to bus collection with matched bus_plate

#3 bus_stop.js<br />
read bs_id (retreive bus stop information)<br />
update number of people waiting (with AI camera perhaps with matched bs_id?)

#4 commuter.js<br />
insert username (pending)<br />
insert bs_id (with geolocation) and time (start)<br />
insert bs_id (with geolocation) and time (end)

#user.js<br />
register user (hash)<br />
login user (hash)<br />
read past_travel_id (left join from commuter.js of the user_id) 

{
  from: "commuter",
  localField: "username",
  foreignField: "username",
  as: "history"
}

