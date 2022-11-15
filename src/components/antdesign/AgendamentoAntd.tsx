import { DeleteOutlined } from '@ant-design/icons';
import { Calendar, Col, Form, Input, Modal, Row, Space, Spin, Table, Tooltip } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import Card from 'antd/lib/card/Card';
import { ColumnsType } from 'antd/lib/table';
import axios from 'axios';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import jCor from '../../assets/jasonCor.json';
import jURL from '../../assets/jasonURLs.json';
import AgendamentoModal from '../../classes/Agendamento';
import FrameCadButtons, { enBotoes } from '../mine/WrapperButtons';
import './AgendamentoAntd.scss';
import InputSearch from './InputSearch';
import ModalConfirm, { EnRetorno } from './ModalConfirm';
import DateUtils from '../../classes/utils/DateUtils';

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
  const [showModal, setShowModal] = useState(undefined as unknown as IModal)
  const [agendamentosDoDia, setAgendamentosDoDia] = useState({} as any)
  const [loading, setLoading] = useState({ descritivo: "", visivel: false })
  const [layoutPadrao, setLayoutPadrao] = useState(!true);

  const [form_digitacao] = Form.useForm();

  const defaultModalProperties = {
    centered: true,
    width: '800px',
    cancelText: 'Sair'
  }

  useEffect(() => {
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
      setAgendamentosDoDia(agendamento);
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
              {/** itens hidden apenas para controle dos _ids. */}
              <Form.Item
                label={'_id do agendamento'}
                name={'_id'}
                hidden={true}>
                <Input />
              </Form.Item>
              <Form.Item
                label={'_id do cliente'}
                name={['person', '_id']}
                hidden={true}>
                <Input />
              </Form.Item>
              {/** apenas para controle visual, quem manda é o "Cliente ID" invisível acima. */}
              <Form.Item label={"Cliente"} name={['person', 'name']}>
                <InputSearch tipo={"cliente"}
                  formController={form_digitacao}
                  formKeyName={['person', '_id']}
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
          // apenas para teste
          //setShowModal({ showModal: EnTipoModal.mConsulta })
          setLayoutPadrao(!layoutPadrao);
          break;
      }
    }

    return (
      <FrameCadButtons
        inEdition={false}
        callbackClick={(e: enBotoes) => _callback(e)}
        orientation={'horizontal'}
        invisible={[enBotoes.eAlterar, enBotoes.eExcluir, enBotoes.eGravar, enBotoes.eCancelar]}
      />
    );
  }

  const ModalDeConfirmacaoDeExclusao = () => {
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

  const MontagemDoConteudo = () => {
    const Detalhado = () => {
      interface TipoDado {
        key: string;
        schedule_time: string,
        client: string,
        situation: string
      }

      const dtSource = () => {
        let horarios: any = [];

        let horarioDeTrabalho = new Date('2022-11-17' + "T00:00:00");
        horarioDeTrabalho.setHours(8, 0, 0, 0);

        let horarioDoFinalDoExpediente = new Date('2022-11-17' + "T00:00:00");
        horarioDoFinalDoExpediente.setHours(19, 30, 0, 0);

        let _variacaoInicialMinutos = 30;

        while (horarioDeTrabalho.getTime() < horarioDoFinalDoExpediente.getTime()) {
          let _variacao = _variacaoInicialMinutos;

          /**
           * Para incluir o agendamento na lista, deve-se:
           * - Conforme a montagem do horário do looping, analisar se há horários agendados no dia para setagem de valor. 
           * - Portanto, desde que esse ID não esteja incluso no Json "horarios", por conta do looping que pode cair no mesmo horário,
           *   e duplicar o registro (é errado).
           * - Se tudo ocorrer bem, o procedimento de inclusão é feito normalmente.
           */

          let _filtrarHorarios = _.filter(agendamentosDoDia, (agendamento: any) => {
            let _jaIncluso = _.filter(horarios, (horario: any) => horario.key === agendamento._id);

            return (new Date(agendamento.date).getHours() === horarioDeTrabalho.getHours()) && (_jaIncluso.length === 0);
          });

          if (_filtrarHorarios.length > 0) {
            _.map(_filtrarHorarios, (value: any) => {
              let _horarioInicial = new Date(value.date);
              let _horarioFinal = new Date(value.date_end);

              _variacao = DateUtils.obterVariacaoMinutosEntreDatas(horarioDeTrabalho, _horarioFinal);

              horarios.push({
                schedule_time: moment(_horarioInicial).format("HH:mm") + ' ' + moment(_horarioFinal).format("HH:mm"),
                client: value.person.name,
                situation: value?.situation,
                key: value._id,
              });

              horarioDeTrabalho.setTime(_horarioFinal.getTime())
            });
          }
          else {
            horarios.push({
              schedule_time: moment(horarioDeTrabalho).format("HH:mm"),
              client: "",
              situation: "Livre",
              key: new Date().getTime(),
            });

            horarioDeTrabalho.setMinutes(horarioDeTrabalho.getMinutes() + _variacao);
          }
        }

        return horarios;
      }

      const colunas: ColumnsType<TipoDado> = [
        {
          title: 'Horário',
          dataIndex: 'schedule_time',
          key: 'schedule_time',
          width: "5%",
        },
        {
          title: 'Cliente',
          dataIndex: 'client',
          key: 'client',
          width: "75%",
        },
        {
          title: 'Situação',
          dataIndex: 'situation',
          key: 'situation',
          width: "20%",
        }
      ];

      return <>
        <Table
          pagination={false}
          columns={colunas}
          dataSource={dtSource()}
          rowClassName={(record) =>
            record.situation === 'Finalizado' ? 'table-row-finished' :
              (record.situation === 'Cancelado' ? 'table-row-canceled' :
                (record.situation === 'Livre' ? 'table-row-free' : 'table-row-pending'))}
        />
      </>
    }

    if (layoutPadrao) {
      return <Calendar locale={locale} dateCellRender={dateCellRender} onPanelChange={panelChange} />;
    } else {
      return <Detalhado />
    }
  }

  return <>
    <Spin tip={loading.descritivo} spinning={loading.visivel}>
      <ModalManutencao />
      <ModalDeConfirmacaoDeExclusao />
      <ModalBusca />
      <ToastContainer />
      <Row justify='end'>
        <FrameBotoesPrincipais />
      </Row>
      <Row>
        <Col span={5}>
          {/*<SidebarSelecao />*/}
        </Col>
        <Col span={19}>
          <MontagemDoConteudo />
        </Col>
      </Row>
    </Spin>
  </>
};

export default Agendamento;