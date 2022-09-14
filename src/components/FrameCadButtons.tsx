import { Button } from "primereact/button";

interface IProps {
    onClickNew?: any,
    onClickEdit?: any,
    onClickDelete?: any,
    onClickSave?: any,
    onClickCancel?: any,
    onSearch?: any
}

const FrameCadButtons = (props: IProps) => {
    const craftButtons = [
        {
            icon: 'pi pi-user-plus',
            onClick: props.onClickNew,
            className: 'p-button-secondary ms-2 p-button-sm'
        },
        {
            icon: 'pi pi-pencil',
            onClick: props.onClickEdit,
            className: 'p-button-secondary ms-2 p-button-sm'
        },
        {
            icon: 'pi pi-trash',
            onClick: props.onClickDelete,
            className: 'p-button-danger ms-2 p-button-sm'
        },
        {
            icon: 'pi pi-check',
            onClick: props.onClickSave,
            className: 'p-button-warning ms-2 p-button-sm',
        },
        {
            icon: 'pi pi-undo',
            onClick: props.onClickCancel,
            className: 'p-button-warning ms-2 p-button-sm'
        },
        {
            icon: 'pi pi-search',
            onClick: props.onSearch,
            className: 'p-button-primary ms-2 p-button-sm'
        }
    ]

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'end', padding: '4px' }}>
                {
                    craftButtons.map((b: any) => {
                        return b.onClick ?
                            <Button icon={b.icon} className={b.className} onClick={() => b.onClick()} /> : ''
                    })
                }
            </div>
        </>
    )
}

export default FrameCadButtons;