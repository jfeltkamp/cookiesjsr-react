import React, { Component } from 'react';
import {connect} from "react-redux";
import SetAllServices from "../UI/SetAllServices";
import Save from "./Services/Save";
import ServiceGroups from "./Services/ServiceGroups";
import { t } from "../../services/TranslationService";

class Layer extends Component {

  constructor(props) {
    super(props);
    this.tabCycle = this.tabCycle.bind(this);
  }

  // Surf on tabs with ArrowUp ArrowDown
  tabCycle(event) {
    if (event.key === 'Tab') {
      const selector = (event.shiftKey) ? '.dialog-last-tab' : '.dialog-first-tab';
      let isIn = this.dialog.contains(document.activeElement);
      if (!isIn) {
        let activeElement = this.dialog.querySelector(selector)
        if (activeElement) {
          activeElement.focus()
        }
      }
    }
  }

  /**
   * Close layer (and deny all services, if option denyAllOnLayerClose is true).
   * See https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9677876#english
   */
  closeLayer() {
    if (this.props.denyAllOnLayerClose) {
      // First check if cookie is already set.
      const servicesCookies = this.props.cookieService.getServices();
      if (servicesCookies && Object.keys(servicesCookies).length === 0) {
        let services = {...this.props.services};
        for (let id in services) {
          if (services.hasOwnProperty(id)) {
            services[id] = false;
          }
        }
        this.props.cookieService.setServices(services);
        this.props.setAllServices(services);
        return false;
      }
    }
    this.props.closeLayer();
  }

  refocusOpener() {
    if (this.willRefocusOpener) {
      const hrefSelector = `a[href="${this.props.openSettingsHash}"]`;
      let settingsBtn = document.querySelector('.cookiesjsr-settings')
        || document.querySelector(hrefSelector);
      if (settingsBtn) { settingsBtn.focus(); }
    }
  }

  componentDidMount() {
    // Issue #3223243: https://www.drupal.org/project/cookies/issues/3223243
    // Only refocus opener link, when not opened from banner.
    this.willRefocusOpener = !this.props.bannerVisible;
    document.addEventListener("keyup", this.tabCycle);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.tabCycle);
    this.refocusOpener();
    if (window.location.hash === this.props.openSettingsHash) {
      window.location.hash = '';
    }
  }

  render() {
    const btnDenyAll = (this.props.showDenyAll)
      ? (<SetAllServices btnType={'invert denyAll'} setAll={false}>{t('denyAll')}</SetAllServices>) : [];
    return (
      <div role="dialog" ref={(dialog) => this.dialog = dialog } aria-labelledby="cookiesjsrLabel" aria-modal="true" className="cookiesjsr-layer--wrapper">
        <div className="cookiesjsr-layer--overlay" title={t('close')} onClick={() => this.props.closeLayer()} />
        <div className="cookiesjsr-layer">
          <header className="cookiesjsr-layer--header">
            <span id="cookiesjsrLabel" className="cookiesjsr-layer--title">{t('cookieSettings')}</span>
            <button type="button" className="cookiesjsr-layer--close dialog-first-tab" onClick={() => this.closeLayer()}>{t('close')}</button>
          </header>
          <div className="cookiesjsr-layer--body">
            <ServiceGroups/>
          </div>
          <footer className="cookiesjsr-layer--footer">
            <div className="cookiesjsr-layer--label-all">{t('settingsAllServices')}</div>
            <div className="cookiesjsr-layer--actions">
              {btnDenyAll}
              <SetAllServices btnType={'invert allowAll'} setAll={true}>{t('acceptAll')}</SetAllServices>
              <Save>{t('saveSettings')}</Save>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    closeLayer: () => {
      return dispatch({type: 'LAYER_OPEN', layerOpen: false})
    },
    setAllServices: (services) => {
      return dispatch({
        type: 'SET_ALL_SERVICES',
        services: services,
        bannerVisible: false,
        layerOpen: false
      })
    }
  }
};

const mapStateToProps = (state) => {
  return {
    openSettingsHash: state.openSettingsHash,
    layerOpen: state.layerOpen,
    denyAllOnLayerClose: state.denyAllOnLayerClose,
    bannerVisible: state.bannerVisible,
    showDenyAll: state.showDenyAll,
    services: state.services,
    cookieService: state.cookieService
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Layer);
