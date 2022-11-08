import { Checkbox, Col, Form, Input, Modal, Row, Spin, Table, Tabs } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Cliente from '../../classes/Cliente';
import FrameCadButtons, { enBotoes } from '../../components/mine/FrameCadButtons';
import '../../style/vars.scss';

const Pessoa = () => {
    const [dataSource, setDataSource] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [deletePerson, setDeletePerson] = useState(false);
    const [inEdition, setInEdition] = useState(false)
    const [loading, setLoading] = useState({ descritivo: "", visivel: false })

    const [formDigitacao] = Form.useForm();

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

    const handleFormSubmit = () => {
        formDigitacao.validateFields()
            .then(async (values) => {
                var _cliente = new Cliente(values, values._id);

                setLoading({ descritivo: "Salvando...", visivel: true });

                _cliente?.send()
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
        return <>
            <Content>
                <Table
                    dataSource={dataSource}
                    columns={tableColumns}
                    onRow={(record) => { return { onClick: () => { formDigitacao.setFieldsValue(record) } }; }}
                />
            </Content>
        </>
    }

    const FrameDigitacao = () => {
        return <>
            <Form form={formDigitacao} layout="vertical">
                <Form.Item label="ID" name={'_id'} >
                    <Input disabled={true} />
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

    useEffect(() => {
        if (deletePerson) {
            var _cliente = new Cliente({}, formDigitacao.getFieldValue('_id'));
            _cliente.delete()
                .then((res: any) => toast.success(res.data.message))
                .catch((e: any) => toast.error('' + e));
        }
    }, [deletePerson])

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
                setOpenDialog(true);
                break;
            case enBotoes.eCancelar:
                setInEdition(false)
                break;
            case enBotoes.eGravar:
                handleFormSubmit()
                break;
            case enBotoes.eProcurar: {
                setLoading({ descritivo: "Carregando...", visivel: true })

                new Cliente({}, "").loadAll()
                    .then((res: any) => setDataSource(res.data))
                    .catch((error: any) => toast.error("Falha na consulta..."))
                    .finally(() => setLoading({ descritivo: "", visivel: false }))
                break;
            }
        }
    }

    return (
        <>
            <Spin tip={loading.descritivo} spinning={loading.visivel}>
                <Row>
                    <Col flex="auto">
                        <Tabs type="card" items={tabs} />
                    </Col>
                    <Col style={{ marginLeft: '1rem' }}>
                        <FrameCadButtons callbackClick={(e: enBotoes) => callbackBotoesPrincipais(e)} inEdition={inEdition} />
                    </Col>
                </Row>
                <Modal
                    title="Exclusão"
                    open={openDialog}
                    onOk={function () {
                        setOpenDialog(false);
                        setDeletePerson(true);
                    }}
                    onCancel={() => setOpenDialog(false)}
                    okText="Sim"
                    cancelText="Não"
                >
                    <p>Deseja excluir o cadastro da pessoa?</p>
                </Modal>
                <ToastContainer />
            </Spin>
        </>
    )
}

export default Pessoa;