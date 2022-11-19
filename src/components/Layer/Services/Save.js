import React, { Component } from 'react';
import Button from '../../UI/Button';
import {connect} from "react-redux";



class Save extends Component {

  saveAndClose() {
    this.props.cookieService.setServices({...this.props.services});
    this.props.closeAll();
  }

  render() {
    return (
      <Button btnType="invert important save dialog-last-tab" clicked={() => this.saveAndClose()}>{this.props.children}</Button>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeAll: () => {
      return dispatch({type: 'CLOSE_ALL'})
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

export default connect(mapStateToProps, mapDispatchToProps)(Save);
