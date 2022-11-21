import React, { Component } from 'react';
import {connect} from "react-redux";
import Service from "./Service";
import GroupConsent from "./GroupConsent";
import { t } from "../../../services/TranslationService";

class ServiceGroup extends Component {
  // Set focus on button
  setBtnActive() {
    if (this.button.getAttribute('aria-selected') === 'true') {
      this.button.focus()
    }
  }

  componentDidMount() {
    this.setBtnActive();
  }
  componentDidUpdate() {
    this.setBtnActive();
  }

  render() {
    let isActive = (this.props.id === this.props.activeGroup);
    let classes = ['cookiesjsr-service-group'];
    if (isActive) {
      classes.push('active');
    }

    let services = [];
    if (this.props.groupConsent) {
      services = (<GroupConsent key={this.props.id} gid={this.props.id} title={t(this.props.id + '.title')} />);
    } else {
      services = (typeof this.props.services !== 'undefined')
        ? this.props.services.map(service => (<Service key={service.key} service={service}/>))
        : [];
    }

    return (
      <li className={classes.join(' ')}>
        <button ref={(button) => this.button = button }
                className="cookiesjsr-service-group--tab" role="tab"
                aria-selected={isActive ? 'true' : 'false'}
                tabIndex={isActive ? '0' : '-1'}
                aria-controls={'panel-'+this.props.id}
                id={'tab-'+this.props.id}
                onClick={() => this.props.setActiveGroup(this.props.id)}>{t(this.props.id + '.title')}</button>
        <div className="cookiesjsr-service-group--content"
             id={'panel-'+this.props.id} role="tabpanel"
             aria-labelledby={'tab-'+this.props.id}
             hidden={!isActive}>
          <div className="cookiesjsr-service-group--intro">
            {t(this.props.id + '.details')}
          </div>
          <ul className="cookiesjsr-service-group--services">
            {services}
          </ul>
        </div>
      </li>
    )
  }

}
const mapDispatchToProps = dispatch => {
  return {
    setActiveGroup: (group) => {
      return dispatch({type: 'ACTIVE_GROUP', activeGroup: group})
    },
  }
};

const mapStateToProps = (state) => {
  return {
    groupConsent: state.groupConsent,
    activeGroup: state.activeGroup
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceGroup);
