import { ErrorMessage } from '@hookform/error-message/dist';
import { Input } from 'antd';
import { Controller } from 'react-hook-form';

interface IProps {
    hookForm: {
        register: any,
        errors: any,
        control: any
    }
    caption: string,
    id?: any
}

const InputText = (props: IProps) => {
    return (
        <div className="d-flex flex-column mb-3">
            <label>{props.caption}</label>
            <Controller
                control={props.control}
                name={props.id}
                {...props.register}
                render={({ field: { name, ref, onBlur, onChange, value } }) => (
                    <Input
                        autoComplete="off"
                        id={name}
                        ref={ref}
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                    />
                )}
            />
            <ErrorMessage
                errors={props.errors}
                name={props.id}
                render={({ message }: any) => <small>{message}</small>}
            />
        </div>
    )

}

export default InputText;