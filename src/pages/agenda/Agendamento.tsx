import { Calendar, Col, Row } from "antd";
import { CalendarMode } from "antd/lib/calendar/generateCalendar";
import { Moment } from "moment";
import './Agendamento.scss';

const Agendamento = () => {

    const onPanelChange = (value: Moment, mode: CalendarMode) => {

    }

    return <>
        <Row>
            <Col span={6}>
                <div className="site-calendar-demo-card">
                    <Calendar fullscreen={false} onPanelChange={onPanelChange} />
                </div>
            </Col>
            <Col span={18}>
                Olá
            </Col>
        </Row>
    </>
}

export default Agendamento;