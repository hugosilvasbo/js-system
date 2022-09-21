import { Checkbox, Col, Form, Input, Modal, Row, Table, Tabs } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import constantes from '../../assets/jsConstantes.json';
import FrameCadButtons from '../../components/mine/FrameCadButtons';
import '../../style/vars.scss';

const Pessoa = () => {
    const URL_PERSON = constantes.url_api_barber + 'person/';

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
                try {
                    let res = null;

                    if (values._id)
                        res = await axios.patch(URL_PERSON + values._id, values)
                    else
                        res = await axios.post(URL_PERSON, values)

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
            axios.delete(URL_PERSON + formDigitacao.getFieldValue('_id'))
                .then((res: any) => {
                    toast.success(res.data.message);
                })
                .catch((e: any) => {
                    toast.error('' + e)
                });
        }
    }, [deletePerson])

    return (
        <>
            <Row>
                <Col flex="auto">
                    <Tabs type="card" items={tabs} />
                </Col>
                <Col style={{ marginLeft: '10px' }}>
                    <FrameCadButtons
                        onClickNew={() => {
                            setInEdition(true)
                            formDigitacao.resetFields();
                        }}
                        onClickEdit={() => {
                            setInEdition(true)
                        }}
                        onClickDelete={() => {
                            setOpenDialog(true);
                        }}
                        onClickCancel={() => {
                            setInEdition(false)
                        }}
                        onClickSearch={async () => {
                            try {
                                let res = await axios.get(URL_PERSON);
                                setDataSource(res.data)
                            } catch (error) {
                                toast.error('Falha na consulta!');
                            }
                        }}
                        onClickSave={handleFormSubmit}
                        inEdition={inEdition}
                    />
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