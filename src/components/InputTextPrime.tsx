import { InputText } from "primereact/inputtext";

interface IProps {
    id: string,
    title: string,
    error?: string
}

const InputTextPrime = (props: IProps) => {
    return (
        <>
            <div className="d-flex flex-column mb-3">
                <label htmlFor={'lbl' + props.id} className="block">{props.title}</label>
                <InputText id={'inpt' + props.id} aria-describedby={'err' + props.id} className="p-inputtext-sm block mb-2" />
                {props.error !== '' ? <small id={'err' + props.id} className="p-error block">{props.error}</small> : ''}
            </div>
        </>
    )
}

export default InputTextPrime;