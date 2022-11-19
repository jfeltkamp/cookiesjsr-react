import React, { Component } from 'react';
import Switch from "../../UI/Switch";
import Links from "../../UI/Links";
import {connect} from "react-redux";

class GroupConsent extends Component {
  /**
   * Lazy loader for groupServices.
   *
   * @returns {[]}
   */
  getGroupServices() {
    if (typeof this.groupServices !== 'object') {
      this.groupServices = (
        typeof this.props.serviceGroups[this.props.gid] === 'object'
        && typeof this.props.serviceGroups[this.props.gid]['services'] === 'object'
      )
      ? this.props.serviceGroups[this.props.gid]['services']
      : this.groupServices = [];
    }
    return this.groupServices;
  }

  /**
   * Return if group is enabled.
   *
   * @returns {boolean}
   */
  groupIsEnabled() {
    let enabled = false;
    for (let service_def of this.getGroupServices()) {
      if (this.props.services[service_def['key']]) {
        enabled = true;
      }
    }
    return enabled;
  }

  /**
   * Return if group needs .
   *
   * @returns {boolean}
   */
  groupNeedConsent() {
    let needConsent = false;
    for (let service_def of this.getGroupServices()) {
      if (service_def['needConsent']) {
        needConsent = true;
      }
    }
    return needConsent;
  }

  setConsent() {
    const enabled = !(this.groupIsEnabled());
    let services = {...this.props.services};
    for (let service_def of this.getGroupServices()) {
      if (service_def['needConsent']) {
        services[service_def['key']] = enabled;
      }
    }
    this.props.setAllServices(services);
  }

  render() {
    let handle = (this.groupNeedConsent())
      ? (<Switch
        title={(this.props.services[this.props.gid]) ? this.props.lang.t('allowed') : this.props.lang.t('denied')}
        descriptionId={'desc_' + this.props.gid}
        activated={this.groupIsEnabled()}
        clicked={() => { this.setConsent() }} />)
      : (<div className="cookiesjsr-service--always-on"><span>{this.props.lang.t('alwaysActive')}</span></div>)

    const links = (this.props.cookieDocs)
      ? [{
        href: this.props.lang.t('cookieDocsUri')  + "#" + this.props.gid,
        title: this.props.lang.t('cookieDocs'),
        attributes: {target: '_blank'}
      }] : [];

    const title = (this.props.gid === 'default') ? this.props.lang.t('requiredCookies') : this.props.title;
    let classes = ['cookiesjsr-service'];
    classes.push('group-' + this.props.gid);
    return (
      <li className={classes.join(' ')}>
        <div className="cookiesjsr-service--description">
          <h3 id={'desc_' + this.props.gid}>{title}</h3>
          <Links links={links} className="cookiesjsr-service--links" direction="row"/>
        </div>
        <div className="cookiesjsr-service--action">
          {handle}
        </div>
      </li>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAllServices: (services) => {
      return dispatch({
        type: 'SET_ALL_SERVICES',
        services: services
      })
    }
  }
};

const mapStateToProps = (state) => {
  return {
    cookieDocs: state.cookieDocs,
    services: state.services,
    serviceGroups: state.serviceGroups,
    lang: state.lang
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupConsent);
