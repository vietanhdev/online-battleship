import axios from 'axios';

const requestStatus = {
  SUCCESS: "success",
  FAIL: "fail"
}

var httpService = axios.create({
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

export default httpService;
export {requestStatus}
