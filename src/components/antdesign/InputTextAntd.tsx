import { ErrorMessage } from '@hookform/error-message/dist';
import { Input } from 'antd';
import { Controller } from 'react-hook-form';

interface IProps {
    hookFormRegister: any,
    hookFormErrors: any,
    hookFormControl: any,
    caption: string,
    id?: any
}

const InputText = (props: IProps) => {
    return (
        <div className="d-flex flex-column mb-3">
            <small>{props.caption}</small>
            <Controller
                control={props.hookFormControl}
                name={props.id}
                render={({ field: { name, onBlur, onChange, value } }) => (
                    <Input
                        placeholder={props.caption}
                        autoComplete="off"
                        id={name}
                        ref={{ ...props.hookFormRegister }}
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                    />
                )}
            />
            <ErrorMessage
                errors={props.hookFormErrors}
                name={props.id}
                render={({ message }: any) => <small>{message}</small>}
            />
        </div>
    )

}

export default InputText;