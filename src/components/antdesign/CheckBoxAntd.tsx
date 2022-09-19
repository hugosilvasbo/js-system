import { Checkbox } from 'antd';
import { Controller } from 'react-hook-form';

interface IProps {
    hookFormRegister: any,
    hookFormControl: any,
    hookFormControlName: string,
    caption: string,
    disabled: boolean,
}

const CheckBoxAntd = (props: IProps) => (
    <>
        <Controller
            control={props.hookFormControl}
            name={props.hookFormControlName}
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
