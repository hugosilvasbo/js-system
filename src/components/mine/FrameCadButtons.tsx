import { CheckOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Row } from 'antd';

interface IProps {
    onClickNew?: any,
    onClickEdit?: any,
    onClickDelete?: any,
    onClickSave?: any,
    onClickCancel?: any,
    onClickSearch?: any,
    inEdition: boolean
}

const FrameCadButtons = (props: IProps) => {
    const craftButtons = [
        {
            onClick: props.onClickNew,
            type: 'reset',
            key: 'new_button',
            icon: <FolderAddOutlined />
        },
        {
            onClick: props.onClickEdit,
            type: 'button',
            key: 'edit_button',
            icon: <EditOutlined />
        },
        {
            onClick: props.onClickDelete,
            type: 'button',
            key: 'delete_button',
            icon: <DeleteOutlined />
        },
        {
            onClick: props.onClickSave,
            type: 'submit',
            key: 'save_button',
            icon: <CheckOutlined />
        },
        {
            onClick: props.onClickCancel,
            type: 'reset',
            key: 'undo_button',
            icon: <RedoOutlined />
        },
        {
            onClick: props.onClickSearch,
            type: 'button',
            key: 'search_button',
            icon: <SearchOutlined />
        }
    ]

    function disableControl(key: string) {
        let disable;
        switch (key) {
            case "new_button":
            case "edit_button":
            case "delete_button":
            case "search_button":
                disable = props.inEdition;
                break;
            default:
                disable = !props.inEdition;
                break;
        }
        return disable;
    }

    return (
        <>
            {
                craftButtons.map((b: any) => {
                    return b.onClick ?
                        <Row key={'btnrow_' + b.key}>
                            <Button
                                htmlType={b.type}
                                icon={b.icon}
                                style={{ marginBottom: '0.4rem' }}
                                onClick={() => b.onClick()}
                                disabled={disableControl(b.key)}
                                shape={'circle'}
                                size={'large'}
                            />
                        </Row>
                        : ''
                })
            }

        </>
    )
}

export default FrameCadButtons;