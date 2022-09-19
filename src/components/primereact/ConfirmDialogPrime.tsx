import { ConfirmDialog } from 'primereact/confirmdialog';

interface IProps {
    yes?: any,
    no?: any,
    visible: boolean,
    message: string,
    header: string,
    hide: any,
    acceptLabel?: string,
    rejectLabel?: string
}

const ConfirmDialogPrime = (props: IProps) => {

    return (
        <>
            <ConfirmDialog
                visible={props.visible}
                onHide={props.hide}
                message={props.message}
                header={props.header}
                icon="pi pi-info-circle"
                accept={props.yes}
                reject={props.no} 
                acceptLabel={props.acceptLabel ? props.acceptLabel : 'Sim'}
                rejectLabel={props.rejectLabel ? props.rejectLabel : 'Não'}
                />
        </>
    )
}

export default ConfirmDialogPrime;