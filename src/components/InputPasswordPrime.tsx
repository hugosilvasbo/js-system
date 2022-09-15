import { Password } from 'primereact/password';

interface IProps {
    id: string,
    title: string,
    value: string,
    onChange: any
}

const InputPasswordPrime = (props: IProps) => {
    return (
        <>
            <div className="d-flex flex-column mb-3">
                <label htmlFor={'lbl' + props.id} className="block">{props.title}</label>
                <Password
                    feedback={false}
                    id={'pass' + props.id}
                    value={props.value || ''}
                    onChange={(e) => props.onChange(e.target.value)} />
                {/*props.errorMessage !== '' ?
                    <small id={'err' + props.id} className="p-error block">
                        {props.errorMessage}
                    </small> : ''*/
                }
            </div>
        </>
    )
}

export default InputPasswordPrime;