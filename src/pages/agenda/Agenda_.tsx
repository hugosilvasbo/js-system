import { Tabs } from "antd";
import Agendamento from "../../components/antdesign/AgendamentoAntd";

const Agenda_ = () => {
    const FrameConsulta = () => {
        return <>
            <Agendamento />
        </>
    }

    const tabs = [
        { label: 'Minha agenda', key: 'tab-consulta', children: <FrameConsulta /> },
    ];

    return (
        <>
            <Tabs type="card" items={tabs} />
        </>
    )
}

export default Agenda_;