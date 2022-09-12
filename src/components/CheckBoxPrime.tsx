import { Checkbox } from 'primereact/checkbox';

interface IProps {
    checked: boolean,
    caption: string,
    onChange: any
}

const CheckBoxPrime = (props: IProps) => {
    return (
        <>
            <div className="field-checkbox d-flex flex-column mb-3">
                <label htmlFor="binary">{props.caption}</label>
                <Checkbox inputId="binary" checked={props.checked} onChange={e => props.onChange(e.checked)} />
            </div>
        </>
    )
}

export default CheckBoxPrime;