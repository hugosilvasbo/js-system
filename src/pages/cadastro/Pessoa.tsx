import { Checkbox, Col, Form, Input, Modal, Row, Table, Tabs } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import jURL from '../../assets/jasonURLs.json';
import FrameCadButtons, { enBotoes } from '../../components/mine/FrameCadButtons';
import '../../style/vars.scss';

const Pessoa = () => {
    const [dataSource, setDataSource] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [deletePerson, setDeletePerson] = useState(false);
    const [inEdition, setInEdition] = useState(false)

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

    const [formDigitacao] = Form.useForm();

    const handleFormSubmit = () => {
        formDigitacao.validateFields()
            .then(async (values) => {
                const _url = jURL.url_api_barber + 'person/';
                try {
                    let res = null;
                    values._id ?
                        res = await axios.patch(_url + values._id, values) :
                        res = await axios.post(_url, values)

                    toast.success(res.data.message)
                } catch (error) {
                    toast.error('' + error);
                } finally {
                    setInEdition(false);
                }
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
            axios.delete(jURL.url_api_barber + 'person/' + formDigitacao.getFieldValue('_id'))
                .then((res: any) => {
                    toast.success(res.data.message);
                })
                .catch((e: any) => {
                    toast.error('' + e)
                });
        }
    }, [deletePerson])

    const callback_botoes_frame = async (_tipo: enBotoes) => {
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
                try {
                    let res = await axios.get(jURL.url_api_barber + 'person/');
                    setDataSource(res.data)
                } catch (error) {
                    toast.error('Falha na consulta!');
                }
                break;
            }
        }
    }

    return (
        <>
            <Row>
                <Col flex="auto">
                    <Tabs type="card" items={tabs} />
                </Col>
                <Col style={{ marginLeft: '1rem' }}>
                    <FrameCadButtons callbackClick={(e: enBotoes) => callback_botoes_frame(e)} inEdition={inEdition} />
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
        </>
    )
}

export default Pessoa;