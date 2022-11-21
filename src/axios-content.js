import axios from 'axios';
import conf from "./services/ConfigService";

const instance = axios.create({
  baseURL: conf.get('apiUrl', '/')
});

export default instance;
