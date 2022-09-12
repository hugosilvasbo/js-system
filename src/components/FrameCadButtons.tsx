import { Button } from "primereact/button";

interface IProps {
    onClickNew?: any,
    onClickEdit?: any,
    onClickDelete?: any,
    onClickSave?: any,
    onClickCancel?: any,
    onSearch?: any
}

const style = {
    display: 'flex',
    justifyContent: 'end',
    padding: '4px'
}

const FrameCadButtons = (props: IProps) => {
    return (
        <>
            <div style={style}>
                {props.onClickNew ? <Button icon="pi pi-user-plus" className="p-button-secondary ms-2 p-button-sm" onClick={() => props.onClickNew()} /> : ''}
                {props.onClickEdit ? <Button icon="pi pi-pencil" className="p-button-secondary ms-2 p-button-sm" onClick={() => props.onClickEdit()} /> : ''}
                {props.onClickDelete ? <Button icon="pi pi-trash" className="p-button-secondary ms-2 p-button-sm" onClick={() => props.onClickDelete()} /> : ''}
                {props.onClickSave ? <Button icon="pi pi-check" className="p-button-danger ms-2 p-button-sm" onClick={() => props.onClickSave()} /> : ''}
                {props.onClickCancel ? <Button icon="pi pi-undo" className="p-button-danger ms-2 p-button-sm" onClick={() => props.onClickCancel()} /> : ''}
                {props.onSearch ? <Button icon="pi pi-search" className="ms-2 p-button-sm" onClick={() => props.onSearch()} /> : ''}
            </div>
        </>
    )
}

export default FrameCadButtons;