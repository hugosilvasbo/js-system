import { Input, Modal } from "antd";
import { useState } from 'react';

interface IProps {
    placeHolder: string,
    tipo: "cliente" | "funcionario" | "agendamento" | "item",
    onCallBack: any
}

const InputSearch = (props: IProps) => {
    const { Search } = Input;

    const Cliente = () => {
        return <>
            <Modal open={props.tipo === "cliente"}>
                Mostrar os dados dos cliente aqui... e criar filtragens.
            </Modal>
        </>
    }

    const onSearch = (value: string) => {
        return <></>
    };

    return <>
        <Search placeholder={props.placeHolder} onSearch={onSearch} />
    </>
}

export default InputSearch;