import { InputText } from "primereact/inputtext";

interface IProps {
    id: string,
    title: string,
    error?: string,
    value: string,
    onChange: any
}

const InputTextPrime = (props: IProps) => {
    return (
        <>
            <div className="d-flex flex-column mb-3">
                <label htmlFor={'lbl' + props.id} className="block">{props.title}</label>
                <InputText
                    id={'inpt' + props.id}
                    value={props.value || ''}
                    aria-describedby={'err' + props.id}
                    className="p-inputtext-sm block mb-2"
                    onChange={(e) => props.onChange(e.target.value)}
                />
                {props.error !== '' ? <small id={'err' + props.id} className="p-error block">{props.error}</small> : ''}
            </div>
        </>
    )
}

export default InputTextPrime;