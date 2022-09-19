import { Checkbox } from 'antd';
import { Controller } from 'react-hook-form';

interface IProps {
    hookFormRegister: any,
    hookFormControl: any,
    caption: string,
    disabled: boolean,
    id?: any
}

const CheckBoxAntd = (props: IProps) => (
    <>
        <Controller
            control={props.hookFormControl}
            name={props.id}
            render={({ field: { name, onChange, value } }) => (
                <Checkbox
                    onChange={onChange}
                    ref={{ ...props.hookFormRegister }}
                    id={name}
                    disabled={props.disabled}
                    checked={value}>{props.caption}</Checkbox>
            )}
        />
    </>
)

export default CheckBoxAntd;
