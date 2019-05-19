import axios from 'axios';

const requestStatus = {
  SUCCESS: "success",
  FAIL: "fail"
}

function getToken() {
  let token = ""
  try {
    token = JSON.parse(localStorage.getItem("user")).token;
  } catch(e) {}
  return token;
}

var request = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/',
  timeout: 10000,
  headers: {'Authorization':  getToken()},
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

request.interceptors.request.use(
  config => {
    config.headers['Authorization'] = 'Bearer ' + getToken()
    return config
  },
  error => {
    Promise.reject(error)
  }
)

request.interceptors.response.use((response) => {
  return response;
}, function (error) {
  return Promise.reject(error.response.data.message);
});

export default request;
export {requestStatus}
