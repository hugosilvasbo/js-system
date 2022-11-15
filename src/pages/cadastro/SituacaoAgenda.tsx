import { Form, Table } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useState } from "react";
import { enBotoes } from "../../components/mine/WrapperButtons";
import WrapperManutencao from "../../components/mine/WrapperManutencao";
import SituacaoClass from '../../classes/AgendamentoSituacao';
import { toast } from "react-toastify";

const SituacaoAgenda = () => {
    const [inEdition, setInEdition] = useState(false);
    const [loading, setLoading] = useState({ descritivo: "", visivel: false });
    const [dataSource, setDataSource] = useState([]);

    const [formDigitacao] = Form.useForm();

    const callbackBotoes = async (botaoSelecionado: enBotoes) => {
        let _sit = null;
        switch (botaoSelecionado) {
            case enBotoes.eProcurar: {
                _sit = new SituacaoClass({}, "");
                setLoading({ descritivo: "Carregando situações...", visivel: true });
                await _sit.loadAll()
                    .then((res: any) => { setDataSource(res.data) })
                    .catch((res: any) => toast.error(res.error))
                    .finally(() => { setLoading({ descritivo: "", visivel: false }) });
                break;
            }
        }
    }

    const TabConsulta = () => {
        const tableColumns = [
            {
                title: 'Descrição',
                dataIndex: 'description',
                key: 'description',
            }
        ]

        return <>
            <Content>
                <Table
                    style={{ cursor: 'pointer' }}
                    dataSource={dataSource}
                    columns={tableColumns}
                    onRow={(record) => { return { onClick: () => { formDigitacao.setFieldsValue(record) } }; }}
                    rowKey={(record: any) => record._id}
                />
            </Content>
        </>
    }

    const TabDigitacao = () => {
        return <></>
    }

    const tabs = [
        { label: 'Consulta', key: 'tab-consulta', children: <TabConsulta /> },
        { label: 'Digitação', key: 'tab-digitacao', children: <TabDigitacao /> }
    ];

    return <>
        <h1 style={{ color: 'red' }}>Apenas funcionando a consulta</h1>
        <WrapperManutencao
            inEdition={inEdition}
            loading={loading}
            callbackClickBotoes={callbackBotoes}
            tabs={tabs}
        />
    </>
};

export default SituacaoAgenda;