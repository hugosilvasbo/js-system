import { DeleteOutlined } from '@ant-design/icons';
import { Calendar, Col, Form, Input, Modal, PageHeader, Row, Space, Spin, Tooltip } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import Card from 'antd/lib/card/Card';
import axios from 'axios';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import jCor from '../../assets/jasonCor.json';
import jURL from '../../assets/jasonURLs.json';
import FrameCadButtons, { enBotoes } from '../mine/FrameCadButtons';
import InputSearch from './InputSearch';
import ModalConfirm, { EnRetorno } from './ModalConfirm';

const _urlPadrao = `${jURL.url_api_barber}schedule`

export enum EnTipoModal {
  mIndefinido,
  mConsulta,
  mExclusao,
  mManutencao,
  mAbrirModalConfirmExclusao,
  mInclusao
}

interface IModal {
  showModal: EnTipoModal,
  agendamentoID?: any
}

async function buscarNaAPIOsAgendamentosDoMes(value: Moment) {

  const getFiltro = (_primeiro: boolean) => {
    let _retorno = _primeiro ? value.clone().startOf('month') : value.clone().endOf('month');
    return _retorno.format("YYYY-MM-DD")
  }

  let res = await axios.get(_urlPadrao, {
    params: {
      dia_inicial: getFiltro(true),
      dia_final: getFiltro(false)
    }
  })

  let _agrupar_por_data = _.groupBy(res.data, (r: any) => moment(r.date).format("DDMMYYYY"));

  return _agrupar_por_data;
}

const Agendamento = () => {
  const [dados, setDados] = useState({} as any);
  const [hideNoDia, setHideNoDia] = useState(true);
  const [showModal, setShowModal] = useState(undefined as unknown as IModal)
  const [agendamentosDoDia, setAgendamentosDoDia] = useState({} as any)
  const [loading, setLoading] = useState({ descritivo: "", visivel: false })

  const [form_digitacao] = Form.useForm();

  useEffect(() => {
    setHideNoDia(true);

    const fetchData = async () => {
      try {
        setLoading({ descritivo: "Consultando agendamentos...", visivel: true })
        let dados = await buscarNaAPIOsAgendamentosDoMes(moment(new Date()))
        setDados(dados);
      } finally {
        setLoading({ descritivo: "", visivel: false })
      }
    }

    fetchData().catch(console.error)
  }, []);

  const dateCellRender = (value: Moment) => {
    let formato = value.format("DDMMYYYY")
    let agendamentos = _.pick(dados, formato)
    let _style = {
      background: jCor.celulasCalendario,
      padding: '8px',
      margin: '6px',
      borderRadius: '10px',
      color: 'white'
    }

    const ItemLista = (props: any) => {
      const hora_mes = moment(props.data.date).format("HH:mm")

      return (
        <Tooltip placement='leftBottom' title='Clique para mais detalhes'>
          <p style={_style}>{`${hora_mes} - ${props.data.person}`}</p>
        </Tooltip>
      )
    }

    const onClickCedulaDoCalendario = (agendamento: any) => {
      setAgendamentosDoDia(agendamento)
      setHideNoDia(false)
    }

    return (
      _.map(agendamentos, (agendamento: any) => {
        return <>
          {
            <div style={{ height: '100%' }} onClick={() => onClickCedulaDoCalendario(agendamento)}>
              {_.map(agendamento, (a: any) => <ItemLista data={{ person: a.person?.name, date: a.date }} key={`li_${a._id}`} />)}
            </div>
          }
        </>
      }
      )
    );
  }

  const panelChange = async (value: Moment) => {
    let res = await buscarNaAPIOsAgendamentosDoMes(value)
    setDados(res)
  }

  const ModalManutencao = () => {
    const onSubmitForm = async () => {
      try {
        setLoading({ descritivo: "Gravando...", visivel: true })

        let values = await form_digitacao.validateFields();
        let res = null;

        values._id ?
          res = await axios.patch(_urlPadrao + `/${values._id}`, values) :
          res = await axios.post(_urlPadrao, values)

        toast.success(res.data.message)
      } catch (error) {
        toast.error("" + error)
      } finally {
        setLoading({ descritivo: "", visivel: false })
        setShowModal({ showModal: EnTipoModal.mIndefinido })
      }
    }

    const onCallbackInputSearch = (e: any) => {
      console.log({ callback: e })
    }

    return <>
      <Modal
        title={showModal?.showModal === EnTipoModal.mManutencao ? 'Manutenção' : 'Inclusão'}
        centered
        open={[EnTipoModal.mInclusao, EnTipoModal.mManutencao].includes(showModal?.showModal)}
        onOk={onSubmitForm}
        onCancel={() => setShowModal({ showModal: EnTipoModal.mIndefinido })}
        width={800}
        okText={"Gravar"}
        cancelText={"Sair"}
        forceRender
      >
        <Form form={form_digitacao} layout={"vertical"}>
          <Row>
            <Col span={24} >
              <Form.Item label={'ID'} name={'_id'} hidden={true}>
                <Input disabled={true} />
              </Form.Item>
              <Form.Item label={"Cliente"} name={['person', 'name']}>
                <InputSearch placeHolder='Buscar cliente' tipo='cliente' onCallBack={onCallbackInputSearch} />
              </Form.Item>
            </Col>
          </Row>
          <Col span={6}>
            <Form.Item label={"Celular"} name={['person', 'cellphone']}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={"Data"} name={"date"}>
              <Input />
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </>
  }

  const SidebarSelecao = () => {
    const Manutencao = (props: any) => {
      showModal?.showModal === EnTipoModal.mInclusao && form_digitacao.resetFields();

      const onClickRow = () => {
        form_digitacao.setFieldsValue(props.agendamento);
        setShowModal({ showModal: EnTipoModal.mManutencao })
      }

      const onClickDelete = () => {
        setShowModal({ showModal: EnTipoModal.mAbrirModalConfirmExclusao, agendamentoID: props.agendamento._id })
      }

      return <>
        <Card size="small" title={props.agendamento.person?.name} style={{ cursor: 'pointer' }} >
          <Row onClick={onClickRow}>
            <Col>
              <Row>
                <Col>Data</Col>
                <Col>{moment(props.agendamento.date).format("DD/MM/YYYY HH:mm")}</Col>
              </Row>
              <Row>
                <Col>Celular: </Col>
                <Col>{props.agendamento.person?.cellphone}</Col>
              </Row>
            </Col>
          </Row>
          <Tooltip placement='left' title={'Excluir'}>
            <DeleteOutlined style={{ color: 'red' }} onClick={onClickDelete} />
          </Tooltip>
        </Card>
      </>
    }
    return <>
      <PageHeader onBack={() => { setHideNoDia(true) }} title={"Esconder"} />
      {

        <Space direction={'vertical'} size={'small'} style={{ height: '600px', display: 'flex', overflowY: 'auto' }} >
          {
            _.map(agendamentosDoDia, (agendamento: any) => {
              return <>
                <Tooltip title="Clique para alterar" placement='right'>
                  <Manutencao agendamento={agendamento} />
                </Tooltip>
              </>
            })
          }
        </Space>
      }
    </>
  }

  const ModalBusca = () => {
    return <Modal
      title={"Buscar agendamento"}
      centered
      open={showModal?.showModal === EnTipoModal.mConsulta}
      onOk={() => { }}
      onCancel={() => setShowModal({ showModal: EnTipoModal.mIndefinido })}
      width={800}
      cancelText={"Sair"}
    />
  }

  const FrameBotoesPrincipais = () => {
    const callback = (_opcao: enBotoes) => {
      switch (_opcao) {
        case enBotoes.eNovo:
          setShowModal({ showModal: EnTipoModal.mInclusao })
          break;
        case enBotoes.eProcurar:
          setShowModal({ showModal: EnTipoModal.mConsulta })
          break;
      }
    }

    return <FrameCadButtons
      inEdition={false}
      callbackClick={(e: enBotoes) => callback(e)}
      orientation={'horizontal'}
      invisible={[enBotoes.eAlterar, enBotoes.eExcluir, enBotoes.eGravar, enBotoes.eCancelar]}
    />
  }

  const ModalDeConfirmacao = () => {
    const _excluirAgendamento = async (_id: any) => {
      try {
        setLoading({ descritivo: "Excluindo...", visivel: true })
        let res = await axios.delete(`${_urlPadrao}/${_id}`)
        toast.success(res.data.message)
      } catch (error) {
        console.log({ exclusao: error })
        toast.error('Falha ao excluir...')
      } finally {
        setLoading({ descritivo: "", visivel: false })
        setShowModal({ showModal: EnTipoModal.mIndefinido })
      }
    }

    const callback = (_opcaoSelecionada: EnRetorno) => {
      switch (_opcaoSelecionada) {
        case EnRetorno.clSim:
          _excluirAgendamento(showModal.agendamentoID)
          break;
        default: {
          setShowModal({ showModal: EnTipoModal.mIndefinido })
        }
      }
    }

    return <ModalConfirm
      tipo={'excluir'}
      abrir={showModal?.showModal === EnTipoModal.mAbrirModalConfirmExclusao}
      callback={callback} />
  }

  return <>
    <Spin tip={loading.descritivo} spinning={loading.visivel}>
      <ModalManutencao />
      <ModalDeConfirmacao />
      <ModalBusca />
      <ToastContainer />
      <Row justify='end'>
        <FrameBotoesPrincipais />
      </Row>
      <Row>
        <Col span={hideNoDia ? 0 : 3}>
          <SidebarSelecao />
        </Col>
        <Col span={hideNoDia ? 25 : 21} style={{ padding: '20px' }}>
          <Calendar locale={locale} dateCellRender={dateCellRender} onPanelChange={panelChange} />
        </Col>
      </Row>
    </Spin>
  </>
};

export default Agendamento;