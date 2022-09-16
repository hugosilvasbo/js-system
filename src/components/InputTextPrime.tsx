import { InputText } from "primereact/inputtext";
import { ErrorMessage } from '@hookform/error-message/dist';

interface IProps {
    caption: string,
    register: any,
    errors: any,
    id?: any,
    value?: any
}

const InputTextPrime = (props: IProps) => {
    return (
        <div className="d-flex flex-column mb-3">
            <label>{props.caption}</label>
            <InputText
                autoComplete="off"
                autoFocus
                className="p-inputtext-sm block mb-2"
                id={props.id}
                {...props.register}
            />

            <ErrorMessage
                errors={props.errors}
                name={props.id}
                render={({ message }: any) => <small>{message}</small>}
            />
        </div>
    )

}

export default InputTextPrime;