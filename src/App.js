import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from './axios-content';
import ConfigService from "./services/ConfigService";
import CookieService from "./services/CookieService";
import Banner from './components/Banner/Banner';
import Layer from './components/Layer/Layer';

import './styles/App.scss';

class App extends Component {

  initAppConfig(cjsrConfig) {
    const conf = new ConfigService(cjsrConfig);
    let settings = conf.get('config.interface', {});

    // Load translation if no translation was delivered.
    const translation = conf.get('translation', false);
    if (translation) {
      this.props.translationReceived(translation);
    } else {
      const translationQuery = conf.get('config.interface.translationQuery', this.props.translationQuery);
      const availableLangs = conf.get('config.interface.availableLangs', this.props.availableLangs);
      const defaultLang = conf.get('config.interface.defaultLang', this.props.defaultLang);
      this.loadTranslation(translationQuery, availableLangs, defaultLang);
    }

    // Define active group if 'default' not available.
    const services =  conf.get('services', {});
    settings.activeGroup = (typeof services[this.props.activeGroup] === 'undefined')
        ? Object.keys(services)[0] : this.props.activeGroup;

    // UI: Show "deny all" Button.
    settings.showDenyAll = conf.get('config.interface.showDenyAll', this.props.showDenyAll);

    // Prepare group configuration.
    settings.serviceGroups = conf.getServiceGroups();

    // Configure services and current state.
    let cookieConf = conf.get('config.cookie', { name: this.props.cookieName });

    settings = {...settings, ...cookieConf}
    cookieConf.callback = conf.get('config.callback', {});

    // Init cookie service and check real cookie status.
    settings.cookieService = new CookieService(cjsrConfig, true, true);
    settings.bannerVisible = settings.cookieService.isUpdateRequired();
    settings.services = settings.cookieService.getServicesStatus();
    settings.openSettingsHash = conf.get('config.interface.openSettingsHash', this.props.openSettingsHash);
    this.props.servicesReceived(settings);
  }

  loadConfiguration() {
    const configQuery = (typeof document.cookiesjsr.configQuery === 'string')
      ? document.cookiesjsr.configQuery : false;
    if (configQuery) {
      let query = configQuery.replace('%lang_id', this.props.currentLang);
      axios.get(query)
        .then(result => {
          delete result.data.configQuery;
          this.initAppConfig(result.data);
        })
        .catch(err => {
          console.log(err);
        });
    } else if (typeof document.cookiesjsr === 'object') {
      // Init with global variable data.
      this.initAppConfig(document.cookiesjsr);
    }
  }

  loadTranslation(translationQuery, availableLangs, defaultLang) {
    const lang = (availableLangs.indexOf(this.props.currentLang) >= 0)
      ? this.props.currentLang : defaultLang;
    let query = translationQuery.replace('%lang_id', lang);
    axios.get(query)
      .then(result => {
        if (typeof result.data === 'object') {
          this.props.translationReceived(result.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  hashChangeHandler() {
    if (window.location.hash === this.props.openSettingsHash) {
      this.props.openLayer();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const self = this;
    if (this.props.openSettingsHash !== prevProps.openSettingsHash) {
      self.hashChangeHandler();

      // Attach
      const selector = 'a[href="%hash"]'.replace('%hash', this.props.openSettingsHash);
      const openLinks = document.querySelectorAll(selector);
      for (let link of openLinks) {
        link.addEventListener('click', function(event) {
          event.preventDefault();
          self.props.openLayer();
        });
      }
    }
  }

  componentDidMount() {
    this.loadConfiguration();
    // Behavior Layer open: initial look-up for the hash, if Layer should open.
    this.hashChangeHandler();
    // Define this as me.
    const self = this;

    // Behavior Layer open: Listen to hash changes not initialized by link click.
    window.addEventListener("hashchange", () => { self.hashChangeHandler() }, false);

    // Behavior Layer open: Listen to clicks on opener link click (avoid to change the location.hash).
    const selector = 'a[href="%hash"]'.replace('%hash', this.props.openSettingsHash);
    const openLinks = document.querySelectorAll(selector);
    for (let link of openLinks) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        self.props.openLayer();
      });
    }
  }

  render() {
    const banner = (this.props.bannerVisible) ? (<Banner/>) : [];
    const layer = (this.props.layerOpen) ? (<Layer/>) : [];
    const tabOutside = (this.props.layerOpen) ? (<span tabIndex={0}/>) : [];
    return (
      <div className="cookiesjsr--app">
        {banner}
        {layer}
        {tabOutside}
      </div>
    )
  };
}

const mapDispatchToProps = dispatch => {
  return {
    servicesReceived: (settings) => {
      return dispatch({type: 'INIT_SERVICES', ...settings })
    },
    translationReceived: (translation) => {
      return dispatch({type: 'SET_TRANSLATION', translation: translation})
    },
    openLayer: () => {
      return dispatch({type: 'LAYER_OPEN', layerOpen: true})
    },
    setAllServices: (services, close) => {
      const opts = (close) ? {bannerVisible: false, layerOpen: false} : {};
      return dispatch({type: 'SET_ALL_SERVICES', services: services, ...opts })
    }
  }
};

const mapStateToProps = (state) => {
  return {
    conf: state.conf,
    activeGroup: state.activeGroup,
    availableLangs: state.availableLangs,
    bannerVisible: state.bannerVisible,
    openSettingsHash: state.openSettingsHash,
    cookieName: state.cookieName,
    cookieService: state.cookieService,
    currentLang: state.currentLang,
    defaultLang: state.defaultLang,
    layerOpen: state.layerOpen,
    serviceGroups: state.serviceGroups,
    configQuery: state.configQuery,
    services: state.services,
    translationQuery: state.translationQuery,
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
