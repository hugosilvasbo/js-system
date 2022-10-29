import { CheckOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Row, Tooltip } from 'antd';

interface IProps {
    onClickNew?: any,
    onClickEdit?: any,
    onClickDelete?: any,
    onClickSave?: any,
    onClickCancel?: any,
    onClickSearch?: any,
    inEdition: boolean,
    orientation?: 'horizontal' | 'vertical'
}

const FrameCadButtons = (props: IProps) => {
    const craftButtons = [
        {
            onClick: props.onClickNew,
            type: 'reset',
            key: 'new_button',
            icon: <FolderAddOutlined />,
            tooltipTitle: 'Novo'
        },
        {
            onClick: props.onClickEdit,
            type: 'button',
            key: 'edit_button',
            icon: <EditOutlined />,
            tooltipTitle: 'Alterar'
        },
        {
            onClick: props.onClickDelete,
            type: 'button',
            key: 'delete_button',
            danger: true,
            icon: <DeleteOutlined />,
            tooltipTitle: 'Excluir'
        },
        {
            onClick: props.onClickSave,
            type: 'submit',
            key: 'save_button',
            icon: <CheckOutlined />,
            tooltipTitle: 'Gravar'
        },
        {
            onClick: props.onClickCancel,
            type: 'reset',
            key: 'undo_button',
            icon: <RedoOutlined />,
            tooltipTitle: 'Cancelar'
        },
        {
            onClick: props.onClickSearch,
            type: 'button',
            key: 'search_button',
            icon: <SearchOutlined />,
            tooltipTitle: 'Pesquisar'
        }
    ];

    const _style = props.orientation === 'horizontal' ?
        { marginLeft: '0.8em', marginBottom: '0.8em' } :
        { marginBottom: '0.8em' };

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
                            <Tooltip placement='bottomRight' title={b.tooltipTitle}>
                                <Button
                                    htmlType={b.type}
                                    icon={b.icon}
                                    style={_style}
                                    onClick={() => b.onClick()}
                                    disabled={disableControl(b.key)}
                                    shape={'circle'}
                                    size={'large'}
                                    danger={b.danger}
                                />
                            </Tooltip>
                        </Row>
                        : ''
                })
            }

        </>
    )
}

export default FrameCadButtons;