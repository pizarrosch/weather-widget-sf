import React, {ChangeEventHandler, forwardRef, KeyboardEventHandler} from "react";
import s from './Input.module.scss';

type Props = {
    onSubmit: KeyboardEventHandler,
}

const Input = forwardRef((props: Props, ref: any) => {
    return (
        <input
            className={s.input}
            onKeyDown={props.onSubmit}
            ref={ref}
            placeholder='Search for the city here...'
        />
    )
});
{
}

export default Input;