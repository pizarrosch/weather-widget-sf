import React from 'react';
import s from './Button.module.scss';

function Button(props: any) {
  return (
    <button className={props.active ? s.activeButton : s.button} onClick={props.onClick}>{props.children}</button>
  )
}

export default Button;