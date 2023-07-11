import React from 'react';
import s from './Button.module.scss';
import cx from 'classnames';

function Button(props: any) {
  return (
    <button
      className={cx(s.button, props.active && s.activeButton)}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}

export default Button;