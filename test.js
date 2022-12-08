function getPosition() {

    return new Promise((res, rej) => {
   
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log("Sorry, your browser does not support HTML5 geolocation.");
      }
  
      function success(position) {
        res(position)
      }
  
      function error(error) {
        console.log("Sorry, we can\'t retrieve your local weather without location permission.");
      }
  
    });
  
  };
  
  async function getLocalWeather() {
    console.log(await getPosition())
  };
  
  getLocalWeather();