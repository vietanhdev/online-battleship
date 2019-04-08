import axios from 'axios';

const requestStatus = {
  SUCCESS: "success",
  FAIL: "fail"
}

var instance = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/',
  timeout: 10000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (data) {
    data = JSON.parse(data)
    if (data.status !== requestStatus.SUCCESS) {
      if (typeof data.message === "undefined") {
        data.message = "Unknown error";
      }
      data.status = requestStatus.FAIL;
    }
    return data;
  }]
});


const request = function(method, url, data=null, auth=false) {
  const onSuccess = function(response) {
    console.debug('Request Successful!', response);
    return response.data;
  }

  const onError = function(error) {
    console.error('Request Failed:', error.config);

    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      console.error('Status:',  error.response.status);
      console.error('Data:',    error.response.data);
      console.error('Headers:', error.response.headers);

    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.error('Error Message:', error.message);
    }

    return Promise.reject(error.response || error.message);
  }


  // Decode token
  let token = ""

  if (auth) {
    try {
      token = JSON.parse(localStorage.getItem("user")).token;
    } catch (e) {
      console.log("Error on decoding the token. Disable auth for HTTP request.");
      auth = false;
    }
  }
  

  return instance({
                    method: method,
                    url: url,
                    data: data,
                    headers: {'Authorization': auth ? token: ""}
                  })
            .then(onSuccess)
            .catch(onError);
}

export default request;
export {requestStatus}
