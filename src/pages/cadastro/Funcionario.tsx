import { Col, Form, Row, Table, Tabs } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Input from "antd/lib/input/Input";
import { Content } from "antd/lib/layout/layout";
import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import jURL from '../../assets/jasonURLs.json';
import FrameCadButtons from "../../components/mine/FrameCadButtons";

const Funcionario = () => {
    const [inEdition, setInEdition] = useState(false)
    const [dataSource, setDataSource] = useState([]);

    const URL_API = jURL.url_api_barber + 'employee/';

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
        formDigitacao.validateFields()
            .then(async (values) => {
                try {
                    let res = null
                    values._id ?
                        res = await axios.patch(URL_API + values._id, values) :
                        res = await axios.post(URL_API, values)

                    console.log({ onSubmit: res.data.message })
                    toast.success(res.data.message)
                } catch (error) {
                    toast.error('' + error)
                } finally {
                    setInEdition(false)
                }
            })
            .catch((errorInfo) => { toast.error(errorInfo) })
    }

    const tabs = [
        { label: 'Consulta', key: 'tab-consulta', children: <TabConsulta /> },
        { label: 'Digitação', key: 'tab-digitacao', children: <TabDigitacao /> }
    ]

    return (
        <>
            <Row>
                <Col flex={'auto'}>
                    <Tabs type="card" items={tabs} />
                </Col>
                <Col style={{ marginLeft: '1rem' }}>
                    <FrameCadButtons
                        onClickNew={() => {
                            setInEdition(true)
                            formDigitacao.resetFields()
                        }}
                        onClickEdit={() => {
                            setInEdition(true)
                        }}
                        onClickDelete={() => {
                            // call the dialog
                        }}
                        onClickCancel={() => {
                            setInEdition(false)
                        }}
                        onClickSave={handleFormSubmit}
                        onClickSearch={() => {
                            axios.get(URL_API)
                                .then((res) => {
                                    setDataSource(res.data)
                                }).catch((e) => {
                                    toast.error(e.error);
                                })
                        }}
                        inEdition={inEdition}
                    />
                </Col>
            </Row>
            <ToastContainer />
        </>
    )
}

export default Funcionario;