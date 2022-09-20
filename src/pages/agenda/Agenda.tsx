import { Col, DatePicker, Form, Row, Table, Tabs } from "antd";
import moment from "moment";
import { useState } from "react";
import { Container } from "react-bootstrap";
import Agendamento from "../../components/antdesign/AgendamentoAntd";
import FrameCadButtons from "../../components/mine/FrameCadButtons";

const Agenda = () => {

    const [dateTimeService, setDateTimeService] = useState()

    const FrameConsulta = () => {
        return <>
            <Agendamento />
        </>
    }

    const FrameDigitacao = () => {
        return <>
            <Container fluid>
                <Row>
                    <Col md='auto'>
                        <Form layout="vertical">
                            <Form.Item name="date-time-appointment" label="Data">
                                <DatePicker
                                    allowClear={false}
                                    showTime
                                    //--> arrumar isso futuramente... filtrar os horários por funcionários...
                                    //onSelect={(e: any) => moment(e._d).format('YYYY-MM-DD HH:MM')}
                                    format="DD/MM/YYYY HH:mm"
                                    minuteStep={15}
                                    disabledDate={(current: any) => {
                                        let customDate = moment().format("YYYY-MM-DD");
                                        return current && current < moment(customDate, "YYYY-MM-DD");
                                    }}
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col>
                        <FrameCadButtons
                            onClickNew={() => { }}
                            inEdition={false}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    }

    const tabs = [
        { label: 'Consulta', key: 'tab-consulta', children: <FrameConsulta /> },
        { label: 'Agendar', key: 'tab-digitacao', children: <FrameDigitacao /> },
    ];

    return (
        <>
            <Container fluid>
                <Tabs type="card" items={tabs} />
            </Container>
        </>
    )
}

export default Agenda;