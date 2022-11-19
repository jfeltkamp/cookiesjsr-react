import React from 'react';

const Button = (props) => (
    <button
        disabled={props.disabled}
        className={['cookiesjsr-btn', props.btnType].join(' ')}
        onClick={props.clicked}>{props.children}</button>
);

export default Button;
