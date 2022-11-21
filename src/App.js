import React, {Component} from 'react';
import {connect} from 'react-redux';
import Banner from './components/Banner/Banner';
import Layer from './components/Layer/Layer';

import './styles/App.scss';

class App extends Component {

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
