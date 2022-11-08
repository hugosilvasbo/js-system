import { Col, Form, Row, Spin, Table, Tabs } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Input from "antd/lib/input/Input";
import { Content } from "antd/lib/layout/layout";
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import FuncionarioModal from '../../classes/Funcionario';
import FrameCadButtons, { enBotoes } from "../../components/mine/FrameCadButtons";

const Funcionario = () => {
    const [inEdition, setInEdition] = useState(false)
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState({ descritivo: "", visivel: false })

    const tableColumns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        }
    ]

    const [formDigitacao] = Form.useForm()

    const TabConsulta = () => {
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

    const TabDigitacao = () => {
        return (
            <>
                <Form form={formDigitacao} layout="vertical">
                    <Form.Item label="ID" name={'_id'} >
                        <Input disabled={true} />
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

    const handleFormSubmit = () => {
        formDigitacao.validateFields().then(async (values) => {
            setLoading({ descritivo: "Gravando...", visivel: true })
            var _funcionario = new FuncionarioModal(values, values._id);
            _funcionario.send()
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
    ]

    const callbackBotoesPrincipais = (_tipo: enBotoes) => {
        switch (_tipo) {
            case enBotoes.eNovo: {
                setInEdition(true)
                formDigitacao.resetFields()
                break;
            }
            case enBotoes.eAlterar:
                setInEdition(true)
                break;
            case enBotoes.eCancelar:
                setInEdition(false)
                break;
            case enBotoes.eGravar:
                handleFormSubmit()
                break;
            case enBotoes.eProcurar: {
                var _func = new FuncionarioModal({}, "");
                setLoading({ descritivo: "Carregando...", visivel: true })
                _func.loadAll()
                    .then((res: any) => setDataSource(res.data))
                    .catch((e: any) => toast.error(e.error))
                    .finally(() => setLoading({ descritivo: "", visivel: false }))
                break;
            }
        }
    }

    return (
        <>
            <Spin tip={loading.descritivo} spinning={loading.visivel}>
                <Row>
                    <Col flex={'auto'}>
                        <Tabs type="card" items={tabs} />
                    </Col>
                    <Col style={{ marginLeft: '1rem' }}>
                        <FrameCadButtons
                            callbackClick={(e: enBotoes) => callbackBotoesPrincipais(e)}
                            inEdition={inEdition}
                        />
                    </Col>
                </Row>
                <ToastContainer />
            </Spin>
        </>
    )
}

export default Funcionario;