const findMyState = () => {

    const status = document.querySelector('.status');

    const success = (position) => {
        console.log(position)
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("latitude: "+latitude +"\n" +'longtitude: ' + longitude)
        // status.textContent = '';
        // const mapLink = document.createElement('a');
        // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
        // status.appendChild(mapLink);
        const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        fetch(geoApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const state = data.principalSubdivision;
            const country = data.countryName;
            status.textContent = `You are in ${state}, ${country} with latitude: ${latitude} °, Longitude: ${longitude} °`;
        })
    }

    const error = () => {
        status.textContent = 'Unable to retrieve your location';
    }

    navigator.geolocation.getCurrentPosition(success, error);

    // if (!navigator.geolocation) {
    //     status.textContent = 'Geolocation is not supported by your browser';
    // }
    // else {
    //     status.textContent = 'Locating…';
    //     navigator.geolocation.getCurrentPosition(success, error);
    // }

}

document.querySelector('.find-me').addEventListener('click', findMyState);