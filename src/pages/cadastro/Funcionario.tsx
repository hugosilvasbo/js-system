import { Col, Form, Row, Tabs } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Input from "antd/lib/input/Input";
import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import constantes from '../../assets/jsConstantes.json';
import FrameCadButtons from "../../components/mine/FrameCadButtons";

const Funcionario = () => {
    const [inEdition, setInEdition] = useState(false)
    const [formDigitacao] = Form.useForm()
    const URL_API = constantes.url_api_barber + 'employee/';

    const TabConsulta = () => {
        return (
            <>
            </>
        )
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

                        }}
                        onClickCancel={() => {
                            setInEdition(false)
                        }}
                        onClickSave={handleFormSubmit}
                        onClickSearch={handleFormSubmit}
                        inEdition={inEdition}
                    />
                </Col>
            </Row>
            <ToastContainer />
        </>
    )
}

export default Funcionario;