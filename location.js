var la = 0;
var lo = 0;
//const BUS = require("./bus_stop");

// function findMyState() {

//     const status = document.querySelector('.status');
    

//     function success (position) {
//         console.log(position)
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;

//         la = latitude;
//         lo = longitude;
//         console.log("latitude: "+latitude +"\n" +'longtitude: ' + longitude)
//         // status.textContent = '';
//         // const mapLink = document.createElement('a');
//         // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
//         // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
//         // status.appendChild(mapLink);
//         const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
//         fetch(geoApiUrl)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data)
//             const state = data.principalSubdivision;
//             const country = data.countryName;
//             status.textContent = `You are in ${state}, ${country} with latitude: ${latitude} °, Longitude: ${longitude} °`;
//         })
        
//     }

//     const error = () => {
//         status.textContent = 'Unable to retrieve your location';
//     }

//     navigator.geolocation.getCurrentPosition(success, error);

// }


function findMyState1() {
    function success (position) {
        console.log(position)
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        console.log( latitude, longitude );
    }
    return navigator.geolocation.getCurrentPosition(success);
}

document.querySelector('.find-me').addEventListener('click', findMyState1);