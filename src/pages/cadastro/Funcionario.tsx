import { Form, Table } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Input from "antd/lib/input/Input";
import { Content } from "antd/lib/layout/layout";
import { useState } from "react";
import { toast } from 'react-toastify';
import FuncionarioClass from '../../classes/Funcionario';
import { enBotoes } from "../../components/mine/WrapperButtons";
import WrapperManutencao from "../../components/mine/WrapperManutencao";

const Funcionario = () => {
    const [inEdition, setInEdition] = useState(false)
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState({ descritivo: "", visivel: false });

    const [formDigitacao] = Form.useForm();

    const TabConsulta = () => {
        const tableColumns = [
            {
                title: 'Nome',
                dataIndex: 'name',
                key: 'name',
            }
        ]

        return <>
            <Content>
                <Table
                    style={{ cursor: 'pointer' }}
                    dataSource={dataSource}
                    columns={tableColumns}
                    rowKey={(record: any) => record._id}
                    onRow={(record) => { return { onClick: () => { formDigitacao.setFieldsValue(record) } }; }}
                />
            </Content>
        </>
    }

    const TabDigitacao = () => {
        return (
            <>
                <Form form={formDigitacao} layout="vertical">
                    <Form.Item label="ID" name={'_id'} hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Nome" name={'name'} >
                        <Input disabled={!inEdition} />
                    </Form.Item>
                    <Form.Item label="Ativo" name={"active"}>
                        <Checkbox defaultChecked={true} disabled={!inEdition} />
                    </Form.Item>
                </Form>
            </>
        )
    }

    const handleFormSubmit = async () => {
        formDigitacao.validateFields().then(async (values) => {
            setLoading({ descritivo: "Gravando...", visivel: true })
            var _funcionario = new FuncionarioClass(values, values._id);
            await _funcionario.send()
                .then((res: any) => toast.success(res.data.message))
                .catch((e: any) => toast.error('' + e))
                .finally(() => {
                    setInEdition(false);
                    setLoading({ descritivo: "", visivel: false })
                })
        }).catch((errorInfo) => { toast.error(errorInfo) })
    }

    const tabs = [
        { label: 'Consulta', key: 'tab-consulta', children: <TabConsulta /> },
        { label: 'Digitação', key: 'tab-digitacao', children: <TabDigitacao /> }
    ];

    const callbackBotoesPrincipais = async (_tipo: enBotoes) => {
        var _func = null;
        switch (_tipo) {
            case enBotoes.eNovo: {
                formDigitacao.resetFields();
                setInEdition(true)
                break;
            }
            case enBotoes.eAlterar:
                setInEdition(true)
                break;
            case enBotoes.eCancelar:
                formDigitacao.resetFields();
                setInEdition(false);
                break;
            case enBotoes.eGravar:
                handleFormSubmit()
                break;
            case enBotoes.eProcurar: {
                _func = new FuncionarioClass({}, "");
                setLoading({ descritivo: "Carregando...", visivel: true })
                await _func.loadAll()
                    .then((res: any) => setDataSource(res.data))
                    .catch((e: any) => toast.error(e.error))
                    .finally(() => setLoading({ descritivo: "", visivel: false }))
                break;
            }
            case enBotoes.eExcluir:
                _func = new FuncionarioClass({}, formDigitacao.getFieldValue("_id"));
                await _func.delete()
                    .then((res: any) => toast.success(res.data.message))
                    .catch((res: any) => toast.error("Falha na exclusão do funcionário!"));
                break;
        }
    }

    return (
        <WrapperManutencao
            callbackClickBotoes={callbackBotoesPrincipais}
            inEdition={inEdition}
            tabs={tabs}
            loading={loading}
            key="wrapper_funcionario"
        />
    )
}

export default Funcionario;