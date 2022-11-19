import React, { Component } from 'react';

class Links extends Component {
  render() {
    let classes = ['cookiesjsr-links'];
    classes.push(this.props.className);

    if (this.props.direction === 'row') classes.push('links--row');

    let links = this.props.links.map((link, index) => {
      let attributes = (typeof link.attributes === 'object') ? link.attributes : {};
      if (link.href.match(/^http(s)?:\/\//)) {
        attributes['rel'] = (typeof attributes['rel'] === 'string') ? attributes['rel'] : 'noopener noreferrer';
        attributes['target'] = (typeof attributes['target'] === 'string') ? attributes['target'] : '_blank';
      }

      return (link.href.match(/^(http|#|\/)/))
        ? (<li key={index}><a href={link.href} {...attributes} onClick={link.clicked}>{link.title}</a></li>)
        : null;
    })

    return (<ul className={classes.join(' ')}>{links}</ul>);
  }
}

export default Links;
