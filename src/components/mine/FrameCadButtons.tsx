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
    onClickSearch?: any,
    inEdition: boolean
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
            key: 'delete_button',
            className: 'p-button-danger p-button-sm'
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
            key: 'search_button',
            className: 'p-button-warning p-button-sm'
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
        <Container>
            {
                craftButtons.map((b: any) => {
                    return b.onClick ?
                        <Row key={'btnrow_' + b.key}>
                            <Button
                                type={b.type}
                                icon={b.icon}
                                className={b.className ? b.className : 'p-button-secondary p-button-sm'}
                                key={b.key}
                                form={b.formcontrol}
                                style={{ marginBottom: '0.4rem' }}
                                onClick={() => b.onClick()}
                                disabled={disableControl(b.key)}
                            />
                        </Row>
                        : ''
                })
            }

        </Container >
    )
}

export default FrameCadButtons;