import React, { Component } from 'react';

class Switch extends Component {
  render() {
    let classes = ['cookiesjsr-switch']
    if (this.props.activated) {
      classes.push('active');
    }
    return (
      <label className={classes.join(' ')} title={this.props.title}
        ><input type="checkbox" aria-describedby={this.props.descriptionId} onChange={this.props.clicked} checked={this.props.activated} /></label>);
  }
}

export default Switch;
