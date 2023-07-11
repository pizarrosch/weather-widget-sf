import React, {ChangeEventHandler, KeyboardEventHandler} from "react";
import s from './Input.module.scss';

function Input({onChange, onSubmit, value}: {
  onChange: ChangeEventHandler,
  onSubmit: KeyboardEventHandler,
  value: string
}) {
  return (
    <input
      className={s.input}
      onChange={onChange}
      onKeyDown={onSubmit}
      value={value}
      placeholder='Search for the city here...'
    />
  )
}

export default Input;