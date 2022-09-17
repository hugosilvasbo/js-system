import { Button } from "primereact/button";
import { Container, Row } from 'react-bootstrap';

interface IProps {
    onClickNew?: any,
    onClickEdit?: any,
    onClickDelete?: any,
    onClickSave?: {
        onClick?: any,
        formControl?: string
    }
    onClickCancel?: any,
    onClickSearch?: any
}

const FrameCadButtons = (props: IProps) => {
    const craftButtons = [
        {
            icon: 'pi pi-user-plus',
            onClick: props.onClickNew,
            type: 'reset',
            key: 'new_button'
        },
        {
            icon: 'pi pi-pencil',
            onClick: props.onClickEdit,
            type: 'button',
            key: 'edit_button'
        },
        {
            icon: 'pi pi-trash',
            onClick: props.onClickDelete,
            type: 'button',
            key: 'delete_button'
        },
        {
            icon: 'pi pi-check',
            onClick: props.onClickSave?.onClick,
            type: 'submit',
            key: 'save_button',
            formcontrol: props.onClickSave?.formControl
        },
        {
            icon: 'pi pi-undo',
            onClick: props.onClickCancel,
            type: 'reset',
            key: 'undo_button'
        },
        {
            icon: 'pi pi-search',
            onClick: props.onClickSearch,
            type: 'button',
            key: 'search_button'
        }
    ]

    return (
        <Container>
            {
                craftButtons.map((b: any) => {
                    return b.onClick ?
                        <Row key={'btnrow_' + b.key}>
                            <Button
                                type={b.type}
                                icon={b.icon}
                                className={'p-button-secondary p-button-sm'}
                                key={b.key}
                                form={b.formcontrol}
                                style={{ marginBottom: '0.4rem' }}
                                onClick={() => b.onClick()} />
                        </Row>
                        : ''
                })
            }

        </Container>
    )
}

export default FrameCadButtons;