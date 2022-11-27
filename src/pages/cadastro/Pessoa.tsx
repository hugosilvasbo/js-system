import { Checkbox, Form, Input, Table } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Cliente from '../../adapters/ClienteAdapter';
import { enBotoes } from '../../components/mine/WrapperButtons';
import WrapperManutencao from '../../components/mine/WrapperManutencao';
import '../../style/vars.scss';

const Pessoa = () => {
    const [dataSource, setDataSource] = useState([]);
    const [inEdition, setInEdition] = useState(false)
    const [loading, setLoading] = useState({ descritivo: "", visivel: false })

    const [formDigitacao] = Form.useForm();

    const handleFormSubmit = async () => {
        await formDigitacao.validateFields()
            .then(async (values) => {
                var _cliente = new Cliente(values, values._id);

                setLoading({ descritivo: "Salvando...", visivel: true });

                await _cliente?.send()
                    .then((res: any) => toast.success(res.data.message))
                    .catch((error: any) => toast.error('' + error))
                    .finally(() => {
                        setInEdition(false)
                        setLoading({ descritivo: "", visivel: false })
                    });
            })
            .catch((errorInfo) => { toast.error(errorInfo) });
    };

    const FrameConsulta = () => {
        const tableColumns = [
            {
                title: 'Nome',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'E-Mail',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Celular',
                dataIndex: 'cellphone',
                key: 'cellphone',
            },

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

    const FrameDigitacao = () => {
        return <>
            <Form form={formDigitacao} layout="vertical">
                <Form.Item label="ID" name={'_id'} hidden={true}>
                    <Input />
                </Form.Item>
                <Form.Item label="Nome" name={'name'} >
                    <Input disabled={!inEdition} />
                </Form.Item>
                <Form.Item label="E-Mail" name={'email'} >
                    <Input disabled={!inEdition} />
                </Form.Item>
                <Form.Item label="Telefone" name={'telephone'} >
                    <Input disabled={!inEdition} />
                </Form.Item>
                <Form.Item label="Celular" name={'cellphone'} >
                    <Input disabled={!inEdition} />
                </Form.Item>
                <Form.Item label="Usuário" name={'user'} >
                    <Input disabled={!inEdition} />
                </Form.Item>
                <Form.Item label="Senha" name={'password'} >
                    <Input.Password disabled={!inEdition} />
                </Form.Item>
                <Form.Item label="Resetar senha" name={"password_reseted"}>
                    <Checkbox disabled={!inEdition} defaultChecked={false} />
                </Form.Item>
            </Form>
        </>
    }

    const tabs = [
        { label: 'Consulta', key: 'tab-consulta', children: <FrameConsulta /> },
        { label: 'Digitação', key: 'tab-digitacao', children: <FrameDigitacao /> },
    ];

    const callbackBotoesPrincipais = async (_tipo: enBotoes) => {
        switch (_tipo) {
            case enBotoes.eNovo:
                setInEdition(true)
                formDigitacao.resetFields();
                break;
            case enBotoes.eAlterar:
                setInEdition(true)
                break;
            case enBotoes.eExcluir:
                var _cliente = new Cliente({}, formDigitacao.getFieldValue('_id'));
                await _cliente.delete()
                    .then((res: any) => toast.success(res.data.message))
                    .catch((e: any) => toast.error('' + e));
                break;
            case enBotoes.eCancelar:
                setInEdition(false)
                break;
            case enBotoes.eGravar:
                handleFormSubmit()
                break;
            case enBotoes.eProcurar: {
                setLoading({ descritivo: "Carregando...", visivel: true })

                await new Cliente({}, "").loadAll()
                    .then((res: any) => setDataSource(res.data))
                    .catch((e: any) => toast.error("Falha na consulta..."))
                    .finally(() => setLoading({ descritivo: "", visivel: false }))
                break;
            }
        }
    }

    return (
        <>
            <WrapperManutencao
                callbackClickBotoes={callbackBotoesPrincipais}
                inEdition={inEdition}
                loading={loading}
                tabs={tabs}
                key={"wrapper_manutencao_pessoa"}
            />
        </>
    )
}

export default Pessoa;