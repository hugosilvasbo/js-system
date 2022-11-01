import { ExclamationCircleOutlined } from "@ant-design/icons/lib/icons";
import { Space } from "antd";
import Modal from "antd/lib/modal/Modal";
import React from "react";

export enum EnRetorno {
    clSim,
    clNao
}

interface IProps {
    abrir: boolean,
    titulo?: string
    observacao?: string,
    tipo: "excluir" | "alterar" | "cancelar" | "gravar",
    callback: any
}

class ModalConfirm extends React.Component<IProps, {}> {
    _getTitulo() {
        if (this.props.titulo)
            return this.props.titulo;

        switch (this.props.tipo) {
            case "alterar":
                return "Deseja alterar o registro?";
            case "cancelar":
                return "Cancelar a operação?"
            case "excluir":
                return "Deseja realmente excluir o registro?"
            case "gravar":
                return "Deseja confirmar a gravação?"
        }
    }

    render() {
        return <>
            <Modal
                open={this.props.abrir}
                title={this._getTitulo()}
                onOk={() => this.props.callback(EnRetorno.clSim)}
                okText={"Continuar"}
                cancelText={"Cancelar"}
                onCancel={() => this.props.callback(EnRetorno.clNao)}>
                <Space>
                    <ExclamationCircleOutlined style={{ color: "red" }} />
                    {this.props.observacao ? this.props.observacao : 'Atenção! Se confirmar, a operação não poderá ser desfeita.'}
                </Space>
            </Modal>
        </>
    }
}

export default ModalConfirm;