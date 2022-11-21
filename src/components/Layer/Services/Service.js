import React, { Component } from 'react';
import Switch from "../../UI/Switch";
import Links from "../../UI/Links";
import {connect} from "react-redux";
import { t } from "../../../services/TranslationService";

class Service extends Component {

  render() {
    let consent = (this.props.service.needConsent)
      ? (<Switch
        key={this.props.service.key}
        descriptionId={'desc_' + this.props.service.key}
        title={(this.props.services[this.props.service.key]) ? t('allowed'):t('denied')}
        activated={this.props.services[this.props.service.key]}
        clicked={() => this.props.toggleService(this.props.service.key)} />)
      : (<div className="cookiesjsr-service--always-on"><span>{t('alwaysActive')}</span></div>)

    let links = [];
    if (typeof this.props.service.uri !== "undefined" && this.props.service.uri)
      links.push({href: this.props.service.uri, title: t('officialWebsite')});

    if (this.props.cookieDocs)
      links.push({
        href: t('cookieDocsUri')  + "#" + this.props.service.key,
        title: t('cookieDocs'),
        attributes: {target: '_blank'}
      });

    let classes = ['cookiesjsr-service'];
    return (
      <li className={classes.join(' ')}>
        <div className="cookiesjsr-service--description">
          <h3 id={'desc_' + this.props.service.key}>{this.props.service.name}</h3>
          <Links links={links} className="cookiesjsr-service--links" direction="row"/>
        </div>
        <div className="cookiesjsr-service--action">
          {consent}
        </div>
      </li>
    )
  }
}
const mapDispatchToProps = dispatch => {
  return {
    toggleService: (service) => {
      return dispatch({
        type: 'TOGGLE_SERVICE',
        service: service
      })
    },
  }
};

const mapStateToProps = (state) => {
  return {
    cookieDocs: state.cookieDocs,
    services: state.services
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Service);
