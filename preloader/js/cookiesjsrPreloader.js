import CookieService from "../../src/services/CookieService";
import ConfigService from "../../src/services/ConfigService";
import debounce from "../../src/services/Debounce";

export default class cjsrPreController {

  constructor(cjsrConfig) {
    this.conf = new ConfigService(cjsrConfig);
    this.appLoaded = false;
    this.cookieService = new CookieService(cjsrConfig, true, true);

    this.scrollController();
    this.hashController();
  }

  /**
   * Load App if scrolling down exceeds the limit.
   */
  scrollController() {
    const limit = this.conf.get('config.library.scrollLimit', 150);
    const self = this;
    if (limit === 0) {
      self.loadApp();
    } else {
      let load = debounce(function() {
        if (document.body.scrollTop > limit || document.documentElement.scrollTop > limit) {
          if(self.cookieService.isUpdateRequired()) {
            self.loadApp();
          }
          window.removeEventListener('scroll', load);
        }
      }, 100)
      window.addEventListener('scroll', load);
    }
  }

  /**
   * Load app by listen on hash changes.
   */
  hashController() {
    const self = this;
    let hashListener = function() {
      if (self.hashCheck()) {
        self.loadApp()
        window.removeEventListener('scroll', hashListener)
      }
    }
    window.addEventListener("hashchange", hashListener);
    // Initial check.
    hashListener();
  }

  /**
   * Check location hash  app by listen on hash changes.
   */
  hashCheck() {
    const hash = this.conf.get('config.interface.openSettingsHash', '#cookiesjsr');
    return (window.location.hash === hash);
  }

  /**
   * Just load the app from location given in config.
   *
   * @returns {boolean}
   */
  loadApp() {
    const libPath = this.conf.get('config.library.libPath', false)
    if (!this.appLoaded && libPath) {
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = libPath + '?v=1.0.13';
      document.head.appendChild(script);
      this.appLoaded = true;
    }
  }
}

