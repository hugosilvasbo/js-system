import { Button } from "primereact/button";

interface IProps {
    onClickNew?: any,
    onClickEdit?: any,
    onClickDelete?: any,
    onClickSave?: any,
    onClickCancel?: any
}

const FrameCadButtons = (props: IProps) => {
    const craftButtons = [
        {
            icon: 'pi pi-user-plus',
            onClick: props.onClickNew,
            className: 'p-button-secondary ms-2 p-button-sm',
            type: 'reset',
            key: 'new_button'
        },
        {
            icon: 'pi pi-pencil',
            onClick: props.onClickEdit,
            className: 'p-button-secondary ms-2 p-button-sm',
            type: 'button',
            key: 'edit_button'
        },
        {
            icon: 'pi pi-trash',
            onClick: props.onClickDelete,
            className: 'p-button-danger ms-2 p-button-sm',
            type: 'button',
            key: 'delete_button'
        },
        {
            icon: 'pi pi-check',
            onClick: props.onClickSave,
            className: 'p-button-primary ms-2 p-button-sm',
            type: 'submit',
            key: 'save_button'
        },
        {
            icon: 'pi pi-undo',
            onClick: props.onClickCancel,
            className: 'p-button-primary ms-2 p-button-sm',
            type: 'reset',
            key: 'undo_button'
        }
    ]

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'end', padding: '4px' }}>
                {
                    craftButtons.map((b: any) => {
                        return b.onClick ?
                            <Button
                                type={b.type}
                                icon={b.icon}
                                className={b.className}
                                key={b.key}
                                onClick={() => b.onClick()} /> : ''
                    })
                }
            </div>
        </>
    )
}

export default FrameCadButtons;