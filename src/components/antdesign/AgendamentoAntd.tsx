import { CloseOutlined } from '@ant-design/icons';
import { Calendar, Col, Form, Input, Modal, Row, Table, Tooltip } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import Card from 'antd/lib/card/Card';
import { ColumnsType } from 'antd/lib/table';
import axios from 'axios';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import jURL from '../../assets/jasonURLs.json';
import AgendamentoModal from '../../classes/Agendamento';
import DateUtils from '../../classes/utils/DateUtils';
import FrameCadButtons, { enBotoes } from '../mine/WrapperButtons';
import './AgendamentoAntd.scss';
import InputSearch from './InputSearch';
import ModalConfirm, { EnRetorno } from './ModalConfirm';

const _urlPadrao = `${jURL.url_api_barber}schedule`

export enum EnTipoModal {
  mIndefinido,
  mExclusao,
  mManutencao,
  mAbrirModalConfirmExclusao,
  mInclusao
}

interface IModal {
  showModal: EnTipoModal,
  agendamentoID?: any
}

interface TipoDado {
  key: string;
  schedule_time: string,
  client: string,
  situation: {
    description: string,
    color: string
  }
}

async function buscarNaAPIOsAgendamentosDoMes(value: Moment) {

  const _getFiltro = (_primeiro: boolean) => {
    let _retorno = _primeiro ? value.clone().startOf('month') : value.clone().endOf('month');
    return _retorno.format("YYYY-MM-DD")
  }

  let res = await axios.get(_urlPadrao, {
    params: {
      date: _getFiltro(true),
      date_end: _getFiltro(false)
    }
  });

  let _agrupar_por_data = _.groupBy(res.data, (r: any) => moment(r.date).format("DDMMYYYY"));

  return _agrupar_por_data;
}

const Agendamento = () => {
  const [dados, setDados] = useState({} as any);
  const [showModal, setShowModal] = useState(undefined as unknown as IModal)
  const [agendamentosDoDia, setAgendamentosDoDia] = useState({} as any)
  const [layoutPadrao, setLayoutPadrao] = useState(true);
  const [hideSidebar, setHideSidebar] = useState(true);
  const [selectedDate, setSelectedDate] = useState(moment(new Date()));

  const [form_digitacao] = Form.useForm();

  const defaultModalProperties = {
    centered: true,
    width: '800px',
    cancelText: 'Sair'
  }

  const fetchData = async (value: Moment) => {
    const _idtoast = toast.loading("Buscando agendamentos...");
    try {
      let dados = await buscarNaAPIOsAgendamentosDoMes(value)
      setDados(dados);
    } finally {
      toast.dismiss(_idtoast);
    }
  }

  useEffect(() => {
    fetchData(moment(new Date())).catch(console.error);
    console.log("Redenrizou a tela...")
  }, []);

  const dateCellRender = (value: Moment) => {
    let formato = value.format("DDMMYYYY");
    let agendamentos = _.pick(dados, formato);

    const ItemLista = (props: any) => {
      const hora_mes = DateUtils.dateFormatHHmm(props.data.date);
      return (
        <Tooltip placement='leftBottom' title='Clique para mais detalhes'>
          <p className='list-items' style={{ backgroundColor: props.data?.background }}>
            {`${hora_mes} - ${props.data.person}`}
          </p>
        </Tooltip>
      )
    }

    const onClickItem = (agendamento: any) => {
      setAgendamentosDoDia(agendamento);
      setHideSidebar(false);
      console.log("Caiu no selected date");
      setSelectedDate(value);
    }

    return (
      _.map(agendamentos, (agendamento: any) => {
        return <>
          {
            <div className='wrapper-cedule' onClick={() => onClickItem(agendamento)}>
              {_.map(agendamento, (a: any) =>
                <ItemLista data={{ person: a.person?.name, date: a.date, background: a.situation?.color }} key={`li_${a._id}`} />
              )}
            </div>
          }
        </>
      }
      )
    );
  }

  const ModalManutencao = () => {

    const _onSubmitForm = async () => {
      await form_digitacao.validateFields()
        .then(async (values: any) => {
          const _agendamento = new AgendamentoModal(values, values._id);
          const _idtoast = toast.loading("Processando...");
          try {
            await _agendamento.send()
              .then((res: any) => toast.success(res.data.message))
              .catch((e: any) => toast.error("" + e))
              .finally(() => {
                setShowModal({ showModal: EnTipoModal.mIndefinido })
              })
          } finally {
            toast.dismiss(_idtoast);
          }
        }).catch((e) => toast.error(e))
    }

    return <>
      <Modal
        {...defaultModalProperties}
        width="90%"
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

  const ModalDeConfirmacaoDeExclusao = () => {
    const _excluirAgendamento = async (_id: any) => {
      const _agendamento = new AgendamentoModal({}, _id);
      const _idtoast = toast.loading("Excluindo agendamento...");
      try {
        await _agendamento.delete()
          .then((res: any) => toast.success(res.data.message))
          .catch((e: any) => toast.error('Falha ao excluir...'))
          .finally(() => {
            //setLoading({ descritivo: "", visivel: false })
            setShowModal({ showModal: EnTipoModal.mIndefinido })
          })
      } finally {
        toast.dismiss(_idtoast);
      }
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

  function dtSourceModeloTabela() {
    if (layoutPadrao === true) {
      return;
    }

    let horarios: any = [];

    /***
     * Passar aqui o dia atual clicado...
     */
    let _dataSelecionada = selectedDate.format("YYYY-MM-DDT00:00:00");

    let horarioDeTrabalho = new Date(_dataSelecionada);
    horarioDeTrabalho.setHours(8, 0, 0, 0);

    let horarioDoFinalDoExpediente = new Date(_dataSelecionada);
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

        return (new Date(agendamento.date).getHours() === horarioDeTrabalho.getHours()) && (_jaIncluso.length <= 0);
      });

      if (_filtrarHorarios.length > 0) {
        _.map(_filtrarHorarios, (value: any) => {
          let _horarioInicial = new Date(value.date);
          let _horarioFinal = new Date(value.date_end);

          _variacao = DateUtils.obterVariacaoMinutosEntreDatas(horarioDeTrabalho, _horarioFinal);

          horarios.push({
            schedule_time: DateUtils.dateFormatHHmm(_horarioInicial) + ' ' + DateUtils.dateFormatHHmm(_horarioFinal),
            client: value.person.name,
            situation: value.situation,
            key: value._id,
          });

          horarioDeTrabalho.setTime(_horarioFinal.getTime())
        });
      }
      else {
        horarios.push({
          schedule_time: DateUtils.dateFormatHHmm(horarioDeTrabalho),
          client: "",
          situation: { description: "Livre", color: "rgb(139 139 139)" },
          key: new Date().getTime(),
        });

        horarioDeTrabalho.setMinutes(horarioDeTrabalho.getMinutes() + _variacao);
      }
    }

    return horarios;
  }

  async function panelChange(value: Moment) {
    await fetchData(value);
  }

  const _callbackBotoes = (_opcao: enBotoes) => {
    switch (_opcao) {
      case enBotoes.eNovo:
        form_digitacao.resetFields();
        setShowModal({ showModal: EnTipoModal.mInclusao })
        break;
      case enBotoes.eProcurar:
        setLayoutPadrao(!layoutPadrao);
        break;
    }
  }

  const colunasModeloTabela: ColumnsType<TipoDado> = [
    {
      title: 'Horário',
      dataIndex: 'schedule_time',
      key: 'schedule_time',
      width: "5%",
      render(text, record) {
        return <span style={{ color: record.situation?.color }}>{record.schedule_time}</span>;
      }
    },
    {
      title: 'Cliente',
      dataIndex: 'client',
      key: 'client',
      width: "75%",
      render(text, record) {
        return <span style={{ color: record.situation?.color }}>{record.client}</span>;
      }
    },
    {
      title: 'Situação',
      dataIndex: ['situation', 'description'],
      key: 'situation',
      width: "20%",
      render(text, record) {
        return <span style={{ color: record.situation?.color }}>{record.situation?.description}</span>;
      }
    }
  ];

  return <>
    <ModalManutencao />
    <ModalDeConfirmacaoDeExclusao />
    <ToastContainer />
    <Row justify='end'>
      <FrameCadButtons
        inEdition={false}
        callbackClick={(e: enBotoes) => _callbackBotoes(e)}
        orientation={'horizontal'}
        invisible={[enBotoes.eAlterar, enBotoes.eExcluir, enBotoes.eGravar, enBotoes.eCancelar]}
        tooltipCaption={[{ button: enBotoes.eProcurar, caption: "Mudar modo de visualização" }]}
      />
    </Row>
    <Row>
      <Col span={hideSidebar ? 0 : 4}>
        <Card
          type='inner'
          size='small'
          title={`Detalhes (${agendamentosDoDia.length})`}
          className="wrapper-sidebar-selection"
          extra={(
            <Tooltip placement='bottom' title={'Fechar o painel'}>
              <CloseOutlined onClick={() => setHideSidebar(true)} />
            </Tooltip>
          )} >
          {
            _.map(agendamentosDoDia, (agendamento: any) => {
              const _onClickItem = () => {
                form_digitacao.setFieldsValue(agendamento);
                setShowModal({ showModal: EnTipoModal.mManutencao })
              }

              return <>
                <Tooltip title={`Clique para alterar - ${agendamento.situation?.description}`}>
                  <Row onClick={_onClickItem} className="sidebar-selection-item" style={{ borderLeft: `4px solid ${agendamento.situation?.color}` }}>
                    {DateUtils.dateFormatHHmm(agendamento.date) + ' ' + agendamento.person?.name}
                  </Row>
                </Tooltip>
              </>
            })
          }
        </Card>
      </Col>
      <Col span={hideSidebar ? 24 : 20}>
        <Col span={layoutPadrao ? 0 : 24}>
          <Table
            pagination={false}
            columns={colunasModeloTabela}
            style={{ padding: '10px' }}
            dataSource={dtSourceModeloTabela()}
            onRow={(data: TipoDado) => {
              return {
                onClick: event => {
                  console.log({ ClickTableManutencao: data })
                  //form_digitacao.setFieldsValue(data);
                  //setShowModal({ showModal: EnTipoModal.mManutencao })
                }
              }
            }}
          />
        </Col>
        <Col span={!layoutPadrao ? 0 : 24}>
          <Calendar locale={locale} dateCellRender={dateCellRender} onPanelChange={panelChange} style={{ padding: '10px' }} />
        </Col>
      </Col>
    </Row>
    {/*</Spin> */}
  </>
};

export default Agendamento;