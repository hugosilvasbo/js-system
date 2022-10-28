import { Tabs } from "antd";
import Agendamento from "../../components/antdesign/AgendamentoAntd";

const Agenda = () => {
    const FrameConsulta = () => {
        return <>
            <Agendamento />
        </>
    }

    const tabs = [
        { label: 'Agendamentos', key: 'tab-consulta', children: <FrameConsulta /> },
    ];

    return (
        <>
            <Tabs type="card" items={tabs} />
        </>
    )
}

export default Agenda;