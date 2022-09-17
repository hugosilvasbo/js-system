import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, Space } from 'antd';

interface IProps {
    caption: string,
    register: any,
    error: any,
    id: string
}

const InputPassword = (props: IProps) => (
    <div className="d-flex flex-column mb-3">
        <label>{props.caption}</label>
        <Space direction="vertical">
            <Input.Password
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                id={props.id}
                {...props.register}
            />
        </Space>
        <small className="p-error block">{props.error}</small>
    </div>

);

export default InputPassword;