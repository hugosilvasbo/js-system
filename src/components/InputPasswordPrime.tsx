import { Password } from 'primereact/password';

interface IProps {
    caption: string,
    register: any,
    error: any,
    id: string
}

const InputPasswordPrime = (props: IProps) => {
    return (
        <>
            <div className="d-flex flex-column mb-3">
                <label>{props.caption}</label>
                <Password
                    inputStyle={{ width: "100%" }}
                    style={{ width: "100%" }}
                    id={props.id}
                    feedback={false}
                    className="p-inputtext-sm block mb-2"
                    {...props.register}
                />
                <small className="p-error block">{props.error}</small>
            </div>
        </>
    )
}

export default InputPasswordPrime;