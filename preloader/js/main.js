import cookiesjsrPreloader from './cookiesjsrPreloader';
import axios from 'axios';
import ConfigService from "../../src/services/ConfigService";

/**
 * Polyfill for CustomEvent constructor. Required for IE9-11.
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
 */
(function () {
  if ( typeof window.CustomEvent === "function" ) return false;
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }

  window.CustomEvent = CustomEvent;
})();

const conf = new ConfigService(document.cookiesjsr);
const configQuery = conf.get('configQuery', false);


// Check if config data exists, else try to load.
if (configQuery) {
    const apiUrl = conf.get('apiUrl', '/');
    const axiosInstance = axios.create({ baseURL: apiUrl });
    // Init with loaded data.
    const currentLang = document.documentElement.lang || navigator.language.substring(0, 2)
        || navigator.userLanguage.substring(0, 2) || 'en';
    let query = configQuery.replace('%lang_id', currentLang);
    axiosInstance.get(query)
        .then(function (result) {
            delete result.data.configQuery;
            document.cookiesjsr = result.data;
            new cookiesjsrPreloader(result.data);
        })
        .catch(function(err) {
            console.log(err);
        });
} else if (typeof document.cookiesjsr.config === 'object' && typeof document.cookiesjsr.services === 'object') {
    // Init with global variable data.
    new cookiesjsrPreloader(document.cookiesjsr);
}
