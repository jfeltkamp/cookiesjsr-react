import React, {Component} from 'react';
import {connect} from 'react-redux';
import Button from '../UI/Button';
import SetAllServices from "../UI/SetAllServices";
import Links from "../UI/Links";
import { t } from "../../services/TranslationService";

class Banner extends Component {

  render() {
    let classes = ['cookiesjsr-banner'];
    if (this.props.bannerVisible) { classes.push('active'); }

    const btnDenyAll = (this.props.showDenyAll)
      ? (<SetAllServices btnType={'important denyAll'} setAll={false}>{t('denyAll')}</SetAllServices>) : [];

    let links = [
      {href: t('privacyUri'), title: t('privacyPolicy'), attributes: {target: '_blank'}},
      {href: t('imprintUri'), title: t('imprint'), attributes: {target: '_blank'}}
    ];

    if (this.props.cookieDocs)
      links.push({
        href: t('cookieDocsUri'),
        title: t('cookieDocs'),
        attributes: {target: '_blank'}
      });

    let btnSett = [];
    if (this.props.settingsAsLink) {
      links.push({
        href: this.props.openSettingsHash,
        title: t('settings'),
        attributes: {className: 'cookiesjsr-settings'},
        clicked: (e) => {
          e.preventDefault();
          this.props.openLayer();
        }
      });
    } else {
      btnSett = (<Button clicked={() => this.props.openLayer()} btnType={['cookiesjsr-settings']}>{t('settings')}</Button>);
    }

    return (
      <div className={classes.join(' ')}>
        <div className="cookiesjsr-banner--info">
          <span className="cookiesjsr-banner--text">{t('bannerText')}</span>
          <Links links={links} className="cookiesjsr-banner--links" direction="row" />
        </div>

        <div className="cookiesjsr-banner--action">
          {btnSett}
          {btnDenyAll}
          <SetAllServices btnType={'important allowAll'} setAll={true}>{t('acceptAll')}</SetAllServices>
        </div>
      </div>
    )
  };
}


const mapDispatchToProps = dispatch => {
  return {
    openLayer: () => {
      return dispatch({type: 'LAYER_OPEN', layerOpen: true})
    },
    acceptAllCookies: () => {
      return dispatch({type: 'ACCEPT_ALL_COOKIES', allCookiesAccepted: true})
    },
  }
};

const mapStateToProps = (state) => {
  return {
    openSettingsHash: state.openSettingsHash,
    settingsAsLink: state.settingsAsLink,
    cookieDocs: state.cookieDocs,
    bannerVisible: state.bannerVisible,
    showDenyAll: state.showDenyAll
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
