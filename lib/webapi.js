import axios from "axios";
import envBase from './env-base.js';
import qs from 'qs';

export default class baseApi extends envBase {
  constructor() {
    axios.interceptors.response.use(response => {
      return response.data;
    }, error => {
      return Promise.reject(error);
    });
    super();
  }

  errorMess = "网络异常！请稍后重试";

  //请求主体
  request(url, data, method, header, responses = "json", withCredentials,onDownloadProgress) {
    if (withCredentials != '') {
      if (withCredentials == 'true') {
        withCredentials = true;
      }
      if (withCredentials == 'false') {
        withCredentials = false;
      }
    } else {
      withCredentials = this.setWithCredentials();
    }
    let headers = this.getHeader(header);
    let dataType = ['get'].includes(method) ? "params" : "data";
    if (headers["Content-Type"].includes('urlencoded') && !['get'].includes(method)) {
      data = qs.stringify(data);
    }
    let configs = {
      url: url,
      method: method,
      headers: headers,
      [dataType]: data,
      responseType: responses,
      withCredentials: withCredentials,
    }
    if (onDownloadProgress) {
      configs['onDownloadProgress'] = onDownloadProgress
    }
    return axios.request(configs).catch(res => {
      this.getMessage(res, 'catch');
    }).then(res => {
      this.getMessage(res, 'then');
      return res;
    })
  }



  //请求头部
  getHeader(header = {}) {
    let ctype = this.contentType(header);
    let headerObj = {
      'Content-Type': ctype
    }
    if (header.type) {
      delete header.type;
    }
    if (typeof header === 'object') {
      Object.assign(headerObj, header);
    }
    let token = this.setToken();
    Object.assign(headerObj, token);
    return headerObj;
  }

  get(url, data, config = {}) {
    return this.requestConfig(url, data, 'get', config)
  }
  post(url, data, config = {}) {
    return this.requestConfig(url, data, 'post', config);
  }
  put(url, data, config = {}) {
    return this.requestConfig(url, data, 'PUT', config);
  }
  delete(url, data, config = {}) {
    return this.requestConfig(url, data, 'delete', config)
  }
  all(array) {
    return axios.all(array);
  }

  requestConfig(url, data, method, config = {}) {
    let [getUrl, header, responseType, withCredentials, onDownloadProgress] = [this.getDomainApi().concat(url), "", "", '', false]
    Object.keys(config).forEach(v => {
      if (v == "isUrl") {
        //第三方网址，全址，不带前缀
        getUrl = url;
      } else if (v == "header") {
        //自定义头部
        header = config[v];
      } else if (v == "responseType") {
        //设置responseType 类别 如 json 
        responseType = config[v];
      } else if (v == "env") {
        getUrl = this.getDomainApi(config[v]).concat(url)
      } else if (v == "withCredentials") {
        withCredentials = config[v]
      } else if (v == 'Url') {
        getUrl = config[v].concat(url);
      } else if (v == 'download') {
        onDownloadProgress = config[v];
      }
    })
    return this.request(getUrl, data, method, header, responseType, withCredentials, onDownloadProgress)
  }

  getDomainApi() {
    return "";
  }

  contentType(type = '') {
    // header.type ? "application/x-www-form-urlencoded; charset=UTF-8" : "application/json"
    return "application/json";
  }

  getMessage(res) {
    //show message error
  }

  setWithCredentials() {
    return false
  }

  storage(key, value, type) {
    if (type) {
      localStorage.removeItem(key);
    } else {
      if (!!value) {
        return localStorage.setItem(key, JSON.stringify(value));
      } else {
        let val = localStorage.getItem(key) || "";
        return (val && JSON.parse(val)) || "";
      }
    }
  }

  session(key, value, type) {
    if (type) {
      sessionStorage.removeItem(key);
    } else {
      if (!!value) {
        return sessionStorage.setItem(key, JSON.stringify(value));
      } else {
        let val = sessionStorage.getItem(key) || "";
        return (val && JSON.parse(val)) || "";
      }
    }
  }

  setToken() {
    return {}
  }
}