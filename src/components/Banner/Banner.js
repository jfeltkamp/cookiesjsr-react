import React, {Component} from 'react';
import {connect} from 'react-redux';
import Button from '../UI/Button';
import SetAllServices from "../UI/SetAllServices";
import Links from "../UI/Links";

class Banner extends Component {

  render() {
    let classes = ['cookiesjsr-banner'];
    if (this.props.bannerVisible) { classes.push('active'); }

    const btnDenyAll = (this.props.showDenyAll)
      ? (<SetAllServices btnType={'important denyAll'} setAll={false}>{this.props.lang.t('denyAll')}</SetAllServices>) : [];

    let links = [
      {href: this.props.lang.t('privacyUri'), title: this.props.lang.t('privacyPolicy'), attributes: {target: '_blank'}},
      {href: this.props.lang.t('imprintUri'), title: this.props.lang.t('imprint'), attributes: {target: '_blank'}}
    ];

    if (this.props.cookieDocs)
      links.push({
        href: this.props.lang.t('cookieDocsUri'),
        title: this.props.lang.t('cookieDocs'),
        attributes: {target: '_blank'}
      });

    let btnSett = [];
    if (this.props.settingsAsLink) {
      links.push({
        href: this.props.openSettingsHash,
        title: this.props.lang.t('settings'),
        attributes: {className: 'cookiesjsr-settings'},
        clicked: (e) => {
          e.preventDefault();
          this.props.openLayer();
        }
      });
    } else {
      btnSett = (<Button clicked={() => this.props.openLayer()} btnType={['cookiesjsr-settings']}>{this.props.lang.t('settings')}</Button>);
    }

    return (
      <div className={classes.join(' ')}>
        <div className="cookiesjsr-banner--info">
          <span className="cookiesjsr-banner--text">{this.props.lang.t('bannerText')}</span>
          <Links links={links} className="cookiesjsr-banner--links" direction="row" />
        </div>

        <div className="cookiesjsr-banner--action">
          {btnSett}
          {btnDenyAll}
          <SetAllServices btnType={'important allowAll'} setAll={true}>{this.props.lang.t('acceptAll')}</SetAllServices>
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
    showDenyAll: state.showDenyAll,
    lang: state.lang
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
