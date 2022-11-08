import { CheckOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Row, Tooltip } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { useState } from 'react';

export enum enBotoes {
    eNovo,
    eAlterar,
    eExcluir,
    eGravar,
    eCancelar,
    eProcurar
}

interface IProps {
    callbackClick: any,
    inEdition: boolean,
    orientation?: 'horizontal' | 'vertical',
    invisible?: Array<enBotoes>,
    deleteConfirmationOptions?: {
        caption: string,
        content: string
    }
}

const FrameCadButtons = (props: IProps) => {
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const craftButtons = [
        {
            onClick: () => props.callbackClick(enBotoes.eNovo),
            type: 'reset',
            key: 'new_button',
            icon: <FolderAddOutlined />,
            tooltipTitle: 'Novo',
            visible: !props.invisible?.includes(enBotoes.eNovo)
        },
        {
            onClick: () => props.callbackClick(enBotoes.eAlterar),
            type: 'button',
            key: 'edit_button',
            icon: <EditOutlined />,
            tooltipTitle: 'Alterar',
            visible: !props.invisible?.includes(enBotoes.eAlterar)
        },
        {
            onClick: () => {
                setOpenDeleteConfirm(true)
            },
            type: 'button',
            key: 'delete_button',
            danger: true,
            icon: <DeleteOutlined />,
            tooltipTitle: 'Excluir',
            visible: !props.invisible?.includes(enBotoes.eExcluir)
        },
        {
            onClick: () => props.callbackClick(enBotoes.eGravar),
            type: 'submit',
            key: 'save_button',
            icon: <CheckOutlined />,
            tooltipTitle: 'Gravar',
            visible: !props.invisible?.includes(enBotoes.eGravar)
        },
        {
            onClick: () => !props.callbackClick(enBotoes.eCancelar),
            type: 'reset',
            key: 'undo_button',
            icon: <RedoOutlined />,
            tooltipTitle: 'Cancelar',
            visible: !props.invisible?.includes(enBotoes.eCancelar)
        },
        {
            onClick: () => props.callbackClick(enBotoes.eProcurar),
            type: 'button',
            key: 'search_button',
            icon: <SearchOutlined />,
            tooltipTitle: 'Pesquisar',
            visible: !props.invisible?.includes(enBotoes.eProcurar)
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

    const _onClickConfirmation = () => {
        setOpenDeleteConfirm(false);
        props.callbackClick(enBotoes.eExcluir);
    }

    return (
        <>
            <Modal
                title={props.deleteConfirmationOptions?.caption ? props.deleteConfirmationOptions.caption : "Excluir"}
                open={openDeleteConfirm}
                onOk={_onClickConfirmation}
                onCancel={() => setOpenDeleteConfirm(false)}
                okText="Sim"
                cancelText="Não"
            >
                <p>{props.deleteConfirmationOptions?.content ? props.deleteConfirmationOptions?.content : 'Deseja confirmar a exclusão?'} </p>
            </Modal>
            {
                craftButtons.map((b: any) => {
                    return b.visible ?
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