import axios from 'axios';

var httpService = axios.create({
  baseURL: 'http://127.0.0.1:5000/',
  timeout: 3000
});


export default httpService;
