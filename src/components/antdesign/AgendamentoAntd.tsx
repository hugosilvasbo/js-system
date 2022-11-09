import { DeleteOutlined, ExpandAltOutlined } from '@ant-design/icons';
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
import AgendamentoModal from '../../classes/Agendamento';
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

  const _getFiltro = (_primeiro: boolean) => {
    let _retorno = _primeiro ? value.clone().startOf('month') : value.clone().endOf('month');
    return _retorno.format("YYYY-MM-DD")
  }

  let res = await axios.get(_urlPadrao, {
    params: {
      dia_inicial: _getFiltro(true),
      dia_final: _getFiltro(false)
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

  const defaultModalProperties = {
    centered: true,
    width: '800px',
    cancelText: 'Sair'
  }

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

    const _onClickCedulaDoCalendario = (agendamento: any) => {
      setAgendamentosDoDia(agendamento)
      setHideNoDia(false)
    }

    return (
      _.map(agendamentos, (agendamento: any) => {
        return <>
          {
            <div style={{ height: '100%' }} onClick={() => _onClickCedulaDoCalendario(agendamento)}>
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

    const _onSubmitForm = async () => {
      await form_digitacao.validateFields()
        .then(async (values: any) => {
          var _agendamento = new AgendamentoModal(values, values._id);

          await _agendamento.send()
            .then((res: any) => toast.success(res.data.message))
            .catch((e: any) => toast.error("" + e))
            .finally(() => {
              setLoading({ descritivo: "", visivel: false })
              setShowModal({ showModal: EnTipoModal.mIndefinido })
            })
        }).catch((e) => toast.error(e))
    }

    return <>
      <Modal
        {...defaultModalProperties}
        title={showModal?.showModal === EnTipoModal.mManutencao ? 'Manutenção' : 'Inclusão'}
        open={[EnTipoModal.mInclusao, EnTipoModal.mManutencao].includes(showModal?.showModal)}
        onOk={_onSubmitForm}
        onCancel={() => setShowModal({ showModal: EnTipoModal.mIndefinido })}
        okText={"Gravar"}
        forceRender
      >

        <Form form={form_digitacao} layout={"vertical"}>
          <Row>
            <Col span={24} >
              <Form.Item label={'ID'} name={'_id'} hidden={true}>
                <Input disabled={true} />
              </Form.Item>
              <Form.Item label={"Cliente"} name={['person', 'name']}>
                <InputSearch
                  tipo='cliente'
                  placeHolder='Buscar cliente'
                  callback={(res: any) => {
                    console.log({ objetoCapturadoDOInputSearch: res })
                  }}
                />
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

              {/*<Input />*/}
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </>
  }

  const SidebarSelecao = () => {
    const Manutencao = (props: any) => {
      const _onClickItem = () => {
        form_digitacao.setFieldsValue(props.agendamento);
        setShowModal({ showModal: EnTipoModal.mManutencao })
      }

      const _onClickDelete = () => {
        setShowModal({ showModal: EnTipoModal.mAbrirModalConfirmExclusao, agendamentoID: props.agendamento._id })
      }

      const _extra = <>
        <Tooltip placement='left' title={'Excluir'}>
          <DeleteOutlined style={{ color: 'red' }} onClick={_onClickDelete} />
        </Tooltip>
      </>

      return <>
        <Card type="inner" title={moment(props.agendamento.date).format("DD/MM/YYYY HH:mm")} extra={_extra} style={{ cursor: 'pointer' }}>
          <Row onClick={_onClickItem}>
            <p>{props.agendamento.person?.name}</p>
            <p>{props.agendamento.person?.cellphone}</p>
          </Row>
        </Card>
      </>
    }
    return <>
      <PageHeader onBack={() => { setHideNoDia(true) }} subTitle={"Esconder"} backIcon={<ExpandAltOutlined />} />
      {

        <Space direction={'vertical'} size={'small'} style={{ height: '800px', display: 'flex', overflowY: 'auto' }} >
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
      {...defaultModalProperties}
      title={"Buscar agendamento"}
      open={showModal?.showModal === EnTipoModal.mConsulta}
      onOk={() => { }}
      onCancel={() => setShowModal({ showModal: EnTipoModal.mIndefinido })}
    />
  }

  const FrameBotoesPrincipais = () => {
    const _callback = (_opcao: enBotoes) => {
      switch (_opcao) {
        case enBotoes.eNovo:
          form_digitacao.resetFields();
          setShowModal({ showModal: EnTipoModal.mInclusao })
          break;
        case enBotoes.eProcurar:
          setShowModal({ showModal: EnTipoModal.mConsulta })
          break;
      }
    }

    return <FrameCadButtons
      inEdition={false}
      callbackClick={(e: enBotoes) => _callback(e)}
      orientation={'horizontal'}
      invisible={[enBotoes.eAlterar, enBotoes.eExcluir, enBotoes.eGravar, enBotoes.eCancelar]}
    />
  }

  const ModalDeConfirmacao = () => {
    const _excluirAgendamento = async (_id: any) => {
      setLoading({ descritivo: "Excluindo agendamento...", visivel: true })
      var _agendamento = new AgendamentoModal({}, _id);
      await _agendamento.delete()
        .then((res: any) => toast.success(res.data.message))
        .catch((e: any) => toast.error('Falha ao excluir...'))
        .finally(() => {
          setLoading({ descritivo: "", visivel: false })
          setShowModal({ showModal: EnTipoModal.mIndefinido })
        })
    }

    const _callback = (_opcaoSelecionada: EnRetorno) => {
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
      callback={_callback} />
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
        <Col span={hideNoDia ? 0 : 4}>
          <SidebarSelecao />
        </Col>
        <Col span={hideNoDia ? 24 : 20} style={{ padding: '20px' }}>
          <Calendar locale={locale} dateCellRender={dateCellRender} onPanelChange={panelChange} />
        </Col>
      </Row>
    </Spin>
  </>
};

export default Agendamento;