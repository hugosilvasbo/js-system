import { Button, Col, FormInstance, Input, Modal, Row, Table } from "antd";
import { useState } from "react";
import ClienteClass from "../../classes/Cliente";

interface IProps {
    tipo: "cliente" | "funcionario" | "agendamento" | "item",
    value?: any,
    formController: FormInstance,
    formKeyName: any, // descrição da chave para fazer o bind dos _id. 
}

interface IChildren {
    open: boolean,
    onCancel: any,
    callbackSelectedItem: any
}

const SearchCliente = (props: IChildren) => {
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    const modalProperties = {
        width: "900px",
        cancelText: "Sair",
        centered: true,
        open: props.open,
        onCancel: () => props.onCancel(),
    }

    const columns = [
        {
            title: "Nome",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Celular",
            dataIndex: "cellphone",
            key: "cellphone"
        }
    ];

    const onFetch = async () => {
        setIsLoading(true);
        try {
            let _cliente = new ClienteClass({}, "");
            let res = await _cliente.loadAll();
            setDataSource(res.data)
        } catch (error) {
            console.log({ erro_inputsearch: error })
        } finally {
            setIsLoading(false);
        }
    }

    return <>
        <Modal title={"Consulta de clientes"}
            {...modalProperties} >

            <Row justify="end">
                <Col>
                    <Button type="primary" onClick={onFetch}>Buscar</Button>
                </Col>
            </Row>
            <Table
                style={{ cursor: 'pointer' }}
                scroll={{ y: 350 }}
                loading={isLoading}
                columns={columns}
                dataSource={dataSource}
                onRow={(data: any) => {
                    return {
                        onClick: event => {
                            props.callbackSelectedItem(data)
                        }
                    }
                }}
            />
        </Modal>
    </>
}

const InputSearch = (props: IProps) => {
    const { Search } = Input;
    const [showModal, setShoModal] = useState(false);
    const [internalValue, setInternalValue] = useState("")

    return <>
        {/** opções de modais quando clicar na lupinha */}
        <SearchCliente
            open={showModal && props.tipo === "cliente"}
            onCancel={() => setShoModal(false)}
            callbackSelectedItem={(data: any) => {
                setInternalValue(data.name);
                props.formController.setFieldValue(props.formKeyName, data._id)
                setShoModal(false);
            }}
        />
        {/** componente final */}
        <Search
            onSearch={() => setShoModal(true)}
            value={internalValue ? internalValue : props.value}
        />
    </>
}

export default InputSearch;