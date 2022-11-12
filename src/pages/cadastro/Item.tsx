import { Checkbox, Input, Select, Table } from "antd";
import Form from "antd/lib/form";
import { Content } from "antd/lib/layout/layout";
import { useState } from "react";
import { enBotoes } from "../../components/mine/WrapperButtons";
import WrapperManutencao from "../../components/mine/WrapperManutencao";
import ItemClass from '../../classes/Item';
import { toast } from "react-toastify";

const Item = () => {
    const [loading, setLoading] = useState({ descritivo: "", visivel: false });
    const [inEdition, setInEdition] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    const [formDigitacao] = Form.useForm();

    const submit = async () => {
        formDigitacao.validateFields()
            .then(async (values: any) => {
                setLoading({ descritivo: "Processando...", visivel: true });
                var _item = new ItemClass(values, values._id);

                await _item.send()
                    .then((res: any) => toast.success(res.data.message))
                    .catch((res: any) => toast.error("" + res))
                    .finally(() => {
                        setInEdition(false);
                        setLoading({ descritivo: "", visivel: false });
                    })
            }).catch((errorInfo) => { toast.error(errorInfo) });
    }

    const callbackBotoes = async (botaoSelecionado: enBotoes) => {
        let _item = null;
        switch (botaoSelecionado) {
            case enBotoes.eNovo: {
                formDigitacao.resetFields();
                setInEdition(true);
                break;
            }
            case enBotoes.eAlterar: {
                setInEdition(true);
                break;
            }
            case enBotoes.eCancelar: {
                formDigitacao.resetFields();
                setInEdition(false);
                break;
            }
            case enBotoes.eGravar: {
                submit();
                break;
            }
            case enBotoes.eProcurar: {
                _item = new ItemClass({}, "");
                setLoading({ descritivo: "Carregando itens...", visivel: true });
                await _item.loadAll()
                    .then((res: any) => { setDataSource(res.data.product) })
                    .catch((res: any) => toast.error(res.error))
                    .finally(() => { setLoading({ descritivo: "", visivel: false }) });
                break;
            }
            case enBotoes.eExcluir:
                _item = new ItemClass({}, formDigitacao.getFieldValue('_id'));
                await _item.delete()
                    .then((res: any) => toast.success(res.data.message))
                    .catch((e: any) => toast.error('' + e));
                break;
        }
    }

    const TabConsulta = () => {
        const tableColumns = [
            {
                title: 'Descrição',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: "Valor",
                dataIndex: "price",
                key: 'price'
            },
            {
                title: "Tipo",
                dataIndex: "type",
                key: "type"
            }
        ]

        return <>
            <Content>
                <Table
                    style={{ cursor: 'pointer' }}
                    dataSource={dataSource}
                    columns={tableColumns}
                    onRow={(record) => { return { onClick: () => { formDigitacao.setFieldsValue(record) } }; }}
                    rowKey={(record: any) => record._id}
                />
            </Content>
        </>
    }

    const TabDigitacao = () => {
        return <>
            <Form form={formDigitacao} layout="vertical">
                <Form.Item label="ID" name="_id" hidden={true} >
                    <Input />
                </Form.Item>
                <Form.Item label="Tipo do item" name="type" initialValue={"service"}>
                    <Select
                        style={{ width: 120 }}
                        disabled={!inEdition}
                        options={[
                            { value: 'product', label: 'Produto', },
                            { value: 'service', label: 'Serviço', },
                        ]}
                    />
                </Form.Item>
                <Form.Item label="Descrição" name="description">
                    <Input disabled={!inEdition} />
                </Form.Item>
                <Form.Item label="Preço" name="price">
                    <Input disabled={!inEdition} />
                </Form.Item>
                <Form.Item
                    tooltip="Se selecionado, no aplicativo de agendamentos dos clientes, esse item não ficará disponível para seleção."
                    label="Restrito aos clientes"
                    name="restrict"
                    valuePropName="checked">
                    <Checkbox disabled={!inEdition} />
                </Form.Item>
                <Form.Item label="Ativo" name="active" initialValue={true} valuePropName="checked">
                    <Checkbox disabled={!inEdition} />
                </Form.Item>
            </Form>
        </>
    }

    const tabs = [
        { label: 'Consulta', key: 'tab-consulta', children: <TabConsulta /> },
        { label: 'Digitação', key: 'tab-digitacao', children: <TabDigitacao /> }
    ];

    return (
        <>
            <h2 style={{ color: "red" }}>Analisar o porque não está atualizando o valor quando clica em outro item...</h2>
            <WrapperManutencao
                callbackClickBotoes={callbackBotoes}
                inEdition={inEdition}
                loading={loading}
                tabs={tabs}
                key={"wrapper_item"}
            />
        </>
    )
}

export default Item;