import { Col, Row, Tabs } from "antd";
import Spin from "antd/lib/spin";
import { ToastContainer } from "react-toastify";
import WrapperButtons, { enBotoes } from "./WrapperButtons";

interface ILoading {
    descritivo: string,
    visivel: boolean
}

interface IProps {
    callbackClickBotoes: any,
    inEdition: boolean,
    tabs: any,
    loading: ILoading
}

const WrapperManutencao = (props: IProps) => {
    return <>
        <Spin tip={props.loading.descritivo} spinning={props.loading.visivel}>
            <Row>
                <Col flex={'auto'}>
                    <Tabs type="card" items={props.tabs} />
                </Col>
                <Col style={{ marginLeft: '1rem' }}>
                    <WrapperButtons
                        callbackClick={(e: enBotoes) => props.callbackClickBotoes(e)}
                        inEdition={props.inEdition}
                    />
                </Col>
            </Row>
            <ToastContainer />
        </Spin>
    </>
}

export default WrapperManutencao;