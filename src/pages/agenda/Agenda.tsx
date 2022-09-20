import { Col, DatePicker, Form, Row, Tabs } from "antd";
import moment from "moment";
import Agendamento from "../../components/antdesign/AgendamentoAntd";
import FrameCadButtons from "../../components/mine/FrameCadButtons";

const Agenda = () => {
    const FrameConsulta = () => {
        return <>
            <Agendamento />
        </>
    }

    const FrameDigitacao = () => {
        return <>
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
        </>
    }

    const tabs = [
        { label: 'Consulta', key: 'tab-consulta', children: <FrameConsulta /> },
        { label: 'Agendar', key: 'tab-digitacao', children: <FrameDigitacao /> },
    ];

    return (
        <>
            <Tabs type="card" items={tabs} />
        </>
    )
}

export default Agenda;