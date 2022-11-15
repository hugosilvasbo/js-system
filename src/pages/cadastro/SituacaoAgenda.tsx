import { Form, Input, Table } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useState } from "react";
import { toast } from "react-toastify";
import SituacaoClass from '../../classes/AgendamentoSituacao';
import { enBotoes } from "../../components/mine/WrapperButtons";
import WrapperManutencao from "../../components/mine/WrapperManutencao";

const SituacaoAgenda = () => {
    const [inEdition, setInEdition] = useState(false);
    const [loading, setLoading] = useState({ descritivo: "", visivel: false });
    const [dataSource, setDataSource] = useState([]);

    const [formDigitacao] = Form.useForm();

    const submit = async () => {
        formDigitacao.validateFields()
            .then(async (values: any) => {
                setLoading({ descritivo: "Processando...", visivel: true });
                var _situation = new SituacaoClass(values, values._id);

                await _situation.send()
                    .then((res: any) => toast.success(res.data.message))
                    .catch((res: any) => toast.error("" + res))
                    .finally(() => {
                        setInEdition(false);
                        setLoading({ descritivo: "", visivel: false });
                    })
            }).catch((errorInfo) => { toast.error(errorInfo) });
    }

    const callbackBotoes = async (botaoSelecionado: enBotoes) => {
        let _sit = null;
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
                _sit = new SituacaoClass({}, "");
                setLoading({ descritivo: "Carregando situações...", visivel: true });
                await _sit.loadAll()
                    .then((res: any) => { setDataSource(res.data) })
                    .catch((res: any) => toast.error(res.error))
                    .finally(() => { setLoading({ descritivo: "", visivel: false }) });
                break;
            }
            case enBotoes.eExcluir:
                _sit = new SituacaoClass({}, formDigitacao.getFieldValue('_id'));
                await _sit.delete()
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
                render(text: any, record: any) {
                    return <span style={{ backgroundColor: record.color }}>{text}</span>;
                }
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
                <Form.Item label="Descrição" name="description">
                    <Input disabled={!inEdition} />
                </Form.Item>
                <Form.Item label="Cor" name="color">
                    <Input disabled={!inEdition} />
                </Form.Item>
            </Form>
        </>
    }

    const tabs = [
        { label: 'Consulta', key: 'tab-consulta', children: <TabConsulta /> },
        { label: 'Digitação', key: 'tab-digitacao', children: <TabDigitacao /> }
    ];

    return <>
        <WrapperManutencao
            inEdition={inEdition}
            loading={loading}
            callbackClickBotoes={callbackBotoes}
            tabs={tabs}
        />
    </>
};

export default SituacaoAgenda;