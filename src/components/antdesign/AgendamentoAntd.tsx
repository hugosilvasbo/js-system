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

        function RetornaDate(horario: string) {
          let date = new Date();

          let hora = parseInt(String(horario).substring(0, 2));
          let minuto = parseInt(String(horario).substring(5, 3));

          date.setHours(hora, minuto, 0);
          return date;
        }

        // Obtém os agendamentos.
        const _agendamentos = [
          {
            key: 1,
            ini: '08:00',
            end: '08:30',
            client: 'Hugo Souza',
            situation: 'Finalizado'
          },
          {
            key: 2,
            ini: '09:00',
            end: '10:00',
            client: 'Jorge',
            situation: 'Cancelado'
          },
          {
            key: 3,
            ini: '12:00',
            end: '15:30',
            client: 'Desafio...',
            situation: 'Pendente'
          },
        ];

        let horarioDoInicioDoExpediente = RetornaDate("08:00:00");
        let horarioDoFinalDoExpediente = RetornaDate("19:30:00");

        // horarioBase = horário usado no laço para saber o inicio e o fim de horário que precisamos mostrar ao usuário.
        let horarioBase = new Date();
        horarioBase.setHours(
          horarioDoInicioDoExpediente.getHours(),
          horarioDoInicioDoExpediente.getMinutes(),
          horarioDoInicioDoExpediente.getSeconds(),
          0);

        let _variacaoInicialMinutos = 30;

        while (horarioBase.getTime() < horarioDoFinalDoExpediente.getTime()) {
          let _variacao = _variacaoInicialMinutos;
          let _keyHorario = moment(horarioBase).format('HH:mm');

          let agendamento = _agendamentos.filter((value: any) => value.ini === _keyHorario);

          if (agendamento.length > 0) {
            _variacao = 60; // calcular o horario final com o horario inicial aqui...
            // mostrar os dados abaixo

            horarios.push({
              key: _keyHorario,
              schedule_time: _keyHorario,
              client: '',
              situation: 'Livre'
            });
          } else {
            horarios.push({
              key: _keyHorario,
              schedule_time: _keyHorario,
              client: '',
              situation: 'Livre'
            });
          }

          horarioBase.setMinutes(horarioBase.getMinutes() + _variacao);
        }

        return horarios;
      }

      /*
      const dataSource = () => {
        let todosHorarios: any = [];
        let horariosAgendados: any = [];
        let minutosVariacao = 30;

        function GetHorario(horario: string) {
          let date = new Date();
          date.setHours(parseInt(String(horario).substring(0, 2)), 0, 0);
          return date;
        }

        function MontarHorariosBase() {
          let inicioHorarioExpediente = GetHorario('08:00:00');
          let finalHorarioExpediente = GetHorario('19:00:00');

          let horarioBase = new Date();
          horarioBase.setHours(inicioHorarioExpediente.getHours(), 0, 0, 0);

          while (horarioBase.getHours() < finalHorarioExpediente.getHours()) {
            let horario = moment(horarioBase).format('HH:mm');

            todosHorarios.push({
              key: horario,
              schedule_time: horario,
              client: '',
              situation: 'Livre'
            });

            horarioBase.setMinutes(horarioBase.getMinutes() + minutosVariacao);
          }
        }

        function InputarAgendamentos() {
          horariosAgendados = [
            {
              key: 1,
              ini: '08:00',
              end: '08:30',
              client: 'Hugo Souza',
              situation: 'Finalizado'
            },
            {
              key: 2,
              ini: '09:00',
              end: '10:00',
              client: 'Jorge',
              situation: 'Cancelado'
            },
            {
              key: 3,
              ini: '12:00',
              end: '15:30',
              client: 'Desafio...',
              situation: 'Pendente'
            },
          ];

          _.map(todosHorarios, (value: any, key: string) => {
            _.map(horariosAgendados, (agendamento: any) => {
              if (value.key === agendamento.ini) {
                todosHorarios[key] = {
                  key,
                  schedule_time: agendamento.ini + ' à ' + agendamento.end,
                  client: agendamento.client,
                  situation: agendamento.situation
                }

                let dateInicial = GetHorario(agendamento.ini);
                let dateFinal = GetHorario(agendamento.end);

                let horarioBase = new Date();
                horarioBase.setHours(dateInicial.getHours(), 0, 0, 0);

                console.log(horarioBase.getTime())
                console.log(dateFinal.getTime())

                while (horarioBase.getTime() <= dateFinal.getTime()) {
                  let chave = moment(horarioBase.getDate()).format('HH:mm');
                  console.log({ chaves: chave })

                  todosHorarios = todosHorarios.filter(function (objeto: any) {
                    return objeto.key !== chave
                  });

                  horarioBase.setMinutes(horarioBase.getMinutes() + minutosVariacao);
                }
              }
            })
          });
        }

        MontarHorariosBase();
        InputarAgendamentos();

        return todosHorarios;
      }
      */

      const colunas: ColumnsType<TipoDado> = [
        {
          title: 'Horário',
          dataIndex: 'schedule_time',
          key: 'schedule_time'
        },
        {
          title: 'Cliente',
          dataIndex: 'client',
          key: 'client'
        },
        {
          title: 'Situação',
          dataIndex: 'situation',
          key: 'situation'
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