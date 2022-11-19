import React, { Component } from 'react';
import {connect} from "react-redux";
import Button from './Button';

class SetAllServices extends Component {

  /**
   * Set all services to allow (true) or deny (false).
   *
   * @param setAllValue {boolean}
   */
  setAllSaveAndClose(setAllValue) {
    let services = {...this.props.services};
    for (let id in services) {
      if (services.hasOwnProperty(id)) {
        services[id] = setAllValue;
      }
    }
    this.props.cookieService.setServices(services);
    this.props.setAllServices(services);
  }

  render() {
    let classes = [];
    if (typeof this.props.btnType !== 'undefined') {
      classes.push(this.props.btnType)
    }
    return (
      <Button
        clicked={() => this.setAllSaveAndClose(this.props.setAll)}
        btnType={classes.join(' ')}>{this.props.children}</Button>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
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
    services: state.services,
    cookieName: state.cookieName,
    cookieService: state.cookieService
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SetAllServices);
