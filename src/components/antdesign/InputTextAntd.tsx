import { ErrorMessage } from '@hookform/error-message/dist';
import { Col, Input } from 'antd';
import { Controller } from 'react-hook-form';

interface IProps {
    hookFormRegister: any,
    hookFormErrors: any,
    hookFormControl: any,
    hookFormControlName: string,
    caption: string,
    disabled: boolean
}

const InputText = (props: IProps) => {
    return (
        <Col>
            <small>{props.caption}</small>
            <Controller
                control={props.hookFormControl}
                name={props.hookFormControlName}
                render={({ field: { name, onBlur, onChange, value } }) => (
                    <Input
                        placeholder={props.caption}
                        autoComplete="off"
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                        disabled={props.disabled}
                        ref={{ ...props.hookFormRegister }}
                        name={name}
                    />
                )}
            />
            <ErrorMessage
                errors={props.hookFormErrors}
                name={'err' + props.hookFormControlName}
                render={({ message }: any) => <small>{message}</small>}
            />
        </Col>
    )

}

export default InputText;