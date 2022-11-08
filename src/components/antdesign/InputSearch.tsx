import { Input, Modal } from "antd";
import { useState } from "react";

interface IProps {
    placeHolder: string,
    tipo: "cliente" | "funcionario" | "agendamento" | "item",
    onCallBack: any
}

interface IChildren {
    open: boolean,
    onCancel: any,
    onOK: any
}

const SearchCliente = (props: IChildren) => {
    return <>
        <Modal
            title={"Clientes"}
            width={600}
            okText={"Selecionar"}
            cancelText={"Sair"}
            open={props.open}
            onOk={() => { props.onOK({ object: {}, value: "Simulando o nome de um cliente" }) }}
            onCancel={() => props.onCancel()}
        />
    </>
}

const InputSearch = (props: IProps) => {
    const { Search } = Input;
    const [showModal, setShoModal] = useState(false);
    const [value, setValue] = useState("")

    const _onClickButtonOK = (res: any) => {
        props.onCallBack(res);
        setShoModal(false);
        setValue(res.value)
    }

    return <>
        {/** opções */}
        <SearchCliente
            open={showModal && props.tipo === "cliente"}
            onCancel={() => setShoModal(false)}
            onOK={_onClickButtonOK} />
        {/** componente */}
        <Search
            value={value}
            placeholder={props.placeHolder}
            onSearch={() => setShoModal(true)}
        />
    </>
}

export default InputSearch;