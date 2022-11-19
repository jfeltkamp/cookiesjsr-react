import React, { Component } from 'react';
import ServiceGroup from "./ServiceGroup";
import {connect} from "react-redux";

class ServiceGroups extends Component {


  componentDidMount() {
    // Surf on tabs with ArrowUp ArrowDown
    this.groupList.addEventListener("keydown", event => {
      let direction = 0;
      switch (event.key) {
        case 'ArrowUp':
          direction = -1;
          break;
        case 'ArrowDown':
          direction = 1;
          break;
        default:
      }
      if (direction !== 0) {
        let list = [];
        for (let sgid in this.props.serviceGroups) { list.push(sgid) }
        const currentTab = list.indexOf(this.props.activeGroup);
        let newTab = currentTab + direction;
        newTab = (newTab > list.length - 1) ? 0 : newTab;
        newTab = (newTab < 0) ? list.length - 1 : newTab;
        this.props.setActiveGroup(list[newTab])
      }
    });
  }

  render() {
    let groups = [];
    for (let sgid in this.props.serviceGroups) {
      let group = this.props.serviceGroups[sgid];
      groups.push(
        <ServiceGroup key={group.id} {...group} />
      );
    }
    return (
      <ul ref={(list) => this.groupList = list } className="cookiesjsr-service-groups" role="tablist" aria-label={this.props.lang.t('cookieSettings')}>
        {groups}
      </ul>
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
    serviceGroups: state.serviceGroups,
    activeGroup: state.activeGroup,
    lang: state.lang
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceGroups);
