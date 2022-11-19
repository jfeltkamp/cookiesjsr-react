import axios from '../axios-content';
import ConfigService from "./ConfigService";

class CookieService {

  constructor(cjsrConfig, listen, fire) {
    this.conf = new ConfigService(cjsrConfig);
    this.updateRequired = false;
    this.servicesStatus = {};

    const services = this.serviceActivationStatus();

    if (listen) {
      this.receiveChangeEvents();
    }
    if(fire) {
      this.initialFireEvents(services)
    }
  }

  /**
   * Fires event three times (immediately, DOM ready, page loaded) to enable activate third-party services.
   */
  initialFireEvents(services) {
    this.fireEvent(services);

    const self = this;
    document.addEventListener('DOMContentLoaded', function () {
      self.fireEvent(services);
    });
    window.addEventListener('load', function() {
      self.fireEvent(services);
    });
  }

  /**
   * Fires the event on document where other Javascript can listen to.
   *
   * @param services
   */
  fireEvent(services) {
    let options = {
      bubbles: false,
      detail: {
        services: services
      }
    }
    document.dispatchEvent(new CustomEvent('cookiesjsrUserConsent', options))
  }

  /**
   * Get raw cookie value.
   *
   * @returns {string}
   *   Raw cookie value.
   */
  getCookie() {
    const name = this.conf.get('config.cookie.name', 'cookiesjsr');
    let b = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '{}';
  }

  /**
   * Set cookie.
   *
   * @param services object
   *   The cookie value to set.
   */
  setCookie(services) {
    if (typeof services !== 'object') {
      return false;
    }
    let serviceString = encodeURIComponent(JSON.stringify(services));
    const name = this.conf.get('config.cookie.name', 'cookiesjsr');
    let cookie = name + '=' + serviceString;

    let date = new Date();
    let time = date.getTime();
    const expires = this.conf.get('config.cookie.expires', 2592000000);
    let expireTime = time + parseInt(expires, 10);
    date.setTime(expireTime);

    const secure = (this.conf.get('config.cookie.secure', true)) ? "; Secure=true" : "";
    let sameSite = this.conf.get('config.cookie.sameSite', 'None');
    sameSite = "; SameSite=" + sameSite;
    let domain = this.conf.get('config.cookie.domain', false);
    domain = (domain) ? "; domain=" + domain : '';
    document.cookie = cookie + '; expires=' + date.toUTCString() + secure + sameSite + '; path=/' + domain + ';';
  }

  /**
   * Get services from cookie.
   *
   * @returns {*}
   *   Returns services with activation status.
   */
  getServices() {
    let raw = this.getCookie();
    return JSON.parse(decodeURIComponent(raw));
  }

  /**
   *
   * @param services {object}
   *   Services with their activation setting.
   */
  setServices(services) {
    this.setCookie(services);
    this.fireEvent(services);
    this.sendCallback(services);
    this.serviceActivationStatus();
  }

  /**
   * Send a backend callback with user consent, to save in session.
   *
   * @param services {object}
   *   Services with their activation setting.
   */
  sendCallback(services) {
    const url = this.conf.get('config.callback.url', false);
    if (url) {
      let method = this.conf.get('config.callback.method', 'GET');
      method = method.toUpperCase();
      const headers = this.conf.get('config.callback.header', {});

      if (method === 'GET') {
        axios.get(url, {params: services}).catch(function(err) { console.log(err); });
      } else {
        axios({
          method: method,
          headers: headers,
          data: services,
          url,
        }).then(function (response) {
          try {
            const options = {
              bubbles: false,
              detail: {
                response: response.data
              }
            }
            document.dispatchEvent(new CustomEvent('cookiesjsrCallbackResponse', options))
          } catch(err) { console.log(err); }
        }).catch( function(err) { console.log(err); });
      }
    }
  }


  /**
   * Takes user decisions to de-/activate all services, service groups or individual services and sends them on
   * for storage in the cookie.
   */
  receiveChangeEvents() {
    const self = this;
    // Behavior Service activation: Catch event 'cookiesjsrSetService'.
    document.addEventListener('cookiesjsrSetService', function (event) {
      const input = event.detail;
      let output = self.getServices();

      // En- or disable ALL services.
      if(typeof input.all === 'boolean') {
        for (let srvc in self.servicesStatus) {
          // Individual target weights more than fallback (group target, actual state).
          output[srvc] = input.all;
        }
      }

      // En- or disable complete groups.
      if (typeof input.groups === 'object') {
        const serviceGroups = self.conf.get('services', {});
        for (let group in input.groups) {
          let target = input.groups[group];
          if (typeof serviceGroups[group] === 'object'
            && typeof serviceGroups[group].services === 'object') {
            for (let serviceDefId in serviceGroups[group].services) {
              let serviceDef = serviceGroups[group].services[serviceDefId];
              output[serviceDef.key] = target;
            }
          }
        }
      }

      // En- or disable individual services (opt. overwrites group targets).
      if (typeof input.services !== 'undefined') {
        for (let service in self.servicesStatus) {
          // Individual target weights more than fallback (group target, actual state).
          output[service] = (typeof input.services[service] !== 'undefined')
            ? input.services[service] : output[service];
        }
      }

      self.setServices(output);
    });
  }

  /**
   * Loads all services that require approval from the configuration and compares them with those that are already
   * stored in the cookie. If new services have been added, the updateRequired is set to true.
   *
   * @return {object}
   */
  serviceActivationStatus() {
    this.updateRequired = false;
    let cServices = this.getServices();
    const serviceIds = this.conf.getServiceIds()
    for (let idPos in serviceIds) {
      let id = serviceIds[idPos];
      if (typeof cServices[id] === 'undefined') {
        this.servicesStatus[id] = false;
        this.updateRequired = true;
      } else {
        this.servicesStatus[id] = cServices[id];
      }
    }
    return this.servicesStatus;
  }

  /**
   * Returns if an update of approval from user. (see comment this.serviceActivationStatus())
   *
   * @returns {boolean}
   */
  isUpdateRequired() {
    return this.updateRequired;
  }


  /**
   * Returns if an update of approval from user. (see comment this.serviceActivationStatus())
   *
   * @returns {boolean}
   */
  getServicesStatus() {
    return this.servicesStatus;
  }
}

export default CookieService;

