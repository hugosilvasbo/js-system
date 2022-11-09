import { Button, Col, Input, Modal, Row, Table } from "antd";
import { useState } from "react";
import ClienteClass from "../../classes/Cliente";

interface IProps {
    placeHolder: string,
    tipo: "cliente" | "funcionario" | "agendamento" | "item",
    callback: any
}

interface IChildren {
    open: boolean,
    onCancel: any,
    selectedItem: any
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
        //console.log("onFecth Input Search begin...")
        setIsLoading(true)

        try {
            let _cliente = new ClienteClass({}, "");
            let res = await _cliente.loadAll();
            //console.log({ resInputSearch: res })
            setDataSource(res.data)
        } catch (error) {
            console.log({ erro_inputsearch: error })
        } finally {
            setIsLoading(false)
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
                            props.selectedItem(data)
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
    const [value, setValue] = useState("")

    return <>
        {/** opções de modais quando clicar na lupinha */}
        <SearchCliente
            open={showModal && props.tipo === "cliente"}
            onCancel={() => setShoModal(false)}
            selectedItem={(res: any) => {
                setValue(res.name);
                props.callback(res);
                setShoModal(false);
            }}
        />
        {/** componente final */}
        <Search
            value={value}
            placeholder={props.placeHolder}
            onSearch={() => setShoModal(true)}
        />
    </>
}

export default InputSearch;