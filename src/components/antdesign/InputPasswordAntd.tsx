import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { ErrorMessage } from '@hookform/error-message';
import { Input, Space } from 'antd';
import { Controller } from 'react-hook-form';

interface IProps {
    hookFormRegister: any,
    hookFormErrors: any,
    hookFormControl: any,
    caption: string,
    id?: any
}

const InputPassword = (props: IProps) => (
    <div className="d-flex flex-column mb-3">
        <small>{props.caption}</small>
        <Space direction="vertical">
            <Controller
                control={props.hookFormControl}
                name={props.id}
                render={({ field: { name, onBlur, onChange, value } }) => (
                    <Input.Password
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        id={name}
                        ref={{ ...props.hookFormRegister }}
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                        placeholder={props.caption}
                    />
                )}
            />
            <ErrorMessage
                errors={props.hookFormErrors}
                name={props.id}
                render={({ message }: any) => <small>{message}</small>}
            />
        </Space>
    </div>
);

export default InputPassword;