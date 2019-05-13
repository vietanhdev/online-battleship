import axios from 'axios'
import config from '../config'


const fixErrorMessage = (data) => {
    if (typeof data.errors != "undefined") {
        data.status = 'fail';
    }
}

const createRequestInstance = () => {
    const instance = axios.create({
        baseURL: config.API_URL,
        transformResponse: fixErrorMessage
    });
    return instance;
}

export default createRequestInstance;