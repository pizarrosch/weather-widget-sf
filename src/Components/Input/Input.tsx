import React, {ChangeEventHandler, KeyboardEventHandler} from "react";

function Input({onChange, onSubmit, value}: {
  onChange: ChangeEventHandler,
  onSubmit: KeyboardEventHandler,
  value: string
}) {
  return (
    <input onChange={onChange} onKeyDown={onSubmit} value={value}/>
  )
}

export default Input;