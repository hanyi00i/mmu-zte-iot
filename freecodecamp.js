const successCallback = (position) => {
    console.log(position);
  };
  
  const errorCallback = (error) => {
    console.log(error);
  };
  
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

const id = navigator.geolocation.watchPosition(successCallback, errorCallback);

navigator.geolocation.clearWatch(id);

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
  };
  
  navigator.geolocation.getCurrentPosition(
    successCallback,
    errorCallback,
    options
  );