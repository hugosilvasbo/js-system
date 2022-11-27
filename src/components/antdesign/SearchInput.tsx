import { Button, Col, FormInstance, Input, Modal, Row, Table } from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
import AgendamentoSituacaoClass from "../../adapters/AgendamentoSituacaoAdapter";
import ClienteClass from "../../adapters/ClienteAdapter";
import FuncionarioClass from "../../adapters/FuncionarioAdapter";

export enum EnTipo {
    tCliente,
    tFuncionario,
    tSituacaoAgendamento
}

interface IProps {
    type: EnTipo,
    formController: FormInstance,
    value?: any,
    formKeyName: any, // descrição da chave para fazer o bind dos _id. 
}

interface ISearch {
    showModal: boolean,
    onCancel: any,
    type: EnTipo,
    itemSelected: any
}

interface IColumns {
    title: string,
    dataIndex: string,
    key: string
}

interface IProperties {
    title: string,
    columns: IColumns[],
    fieldShown: string
}

const Component = (props: ISearch) => {
    const [atributos, setAtributos] = useState({} as IProperties);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        switch (props.type) {
            case EnTipo.tCliente: {
                setAtributos({
                    title: "Busca de clientes",
                    fieldShown: "name",
                    columns: [
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
                    ]
                });

                break;
            }
            case EnTipo.tFuncionario: {
                setAtributos({
                    title: "Busca de funcionários",
                    fieldShown: "name",
                    columns: [
                        {
                            title: "Nome",
                            dataIndex: "name",
                            key: "name"
                        }
                    ]
                });
                break;
            }
            case EnTipo.tSituacaoAgendamento: {
                setAtributos({
                    title: "Busca de situação",
                    fieldShown: "description",
                    columns: [
                        {
                            title: "Descrição",
                            dataIndex: "description",
                            key: "description"
                        }
                    ]
                });
                break;
            }
        }
    }, []);

    const onFetch = async () => {
        switch (props.type) {
            case EnTipo.tCliente: {
                let cliente = new ClienteClass({}, "");
                let res = await cliente.loadAll();
                setDataSource(res.data);
                break;
            }
            case EnTipo.tFuncionario: {
                let funcionario = new FuncionarioClass({}, "");
                let res = await funcionario.loadAll();
                setDataSource(res.data);
                break;
            }
            case EnTipo.tSituacaoAgendamento: {
                let situacao = new AgendamentoSituacaoClass({}, "");
                let res = await situacao.loadAll();
                setDataSource(res.data);
                break;
            }
        }
    }

    return <>
        <Modal
            centered
            open={props.showModal}
            onCancel={() => props.onCancel()}
            width={"80%"}
            title={atributos.title}
            cancelText={"Fechar"}
            okButtonProps={{ style: { display: 'none' } }}
        >
            <Row justify="end">
                <Col>
                    <Button type="primary" onClick={() => onFetch()}>
                        Consultar
                    </Button>
                </Col>
            </Row>
            <Table
                style={{ cursor: 'pointer' }}
                scroll={{ y: 350 }}
                columns={atributos.columns}
                dataSource={dataSource}
                onRow={(data: any) => {
                    return {
                        onClick: event => props.itemSelected(data, atributos.fieldShown)
                    }
                }}
            />
        </Modal>
    </>
}

const SearchInput = (props: IProps) => {
    const { Search } = Input;
    const [showModal, setShowModal] = useState(false);
    const [internalValue, setInternalValue] = useState("")

    const onItemSelected = (data: any, fieldShown: string) => {
        setInternalValue(data[fieldShown]);

        let fields = props.formController.getFieldsValue()[props.formKeyName[0]];

        _.forEach(fields, (value: any, key: string) => {
            props.formController.setFieldValue([props.formKeyName[0], key], data[key]);
        });

        setShowModal(false);
    }

    return <>
        <Component
            showModal={showModal}
            onCancel={() => setShowModal(false)}
            type={props.type}
            itemSelected={onItemSelected}
        />
        <Search
            onSearch={() => setShowModal(true)}
            value={internalValue ? internalValue : props.value}
            readOnly={true}
        />
    </>
}

export default SearchInput;