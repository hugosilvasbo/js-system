/**
 * @author Hugo S. de Souza <hugosilva.souza@hotmail.com>
 */

import { DeleteOutlined } from '@ant-design/icons';
import { Calendar, Col, Form, Input, Modal, Row, Space, Tooltip } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import Card from 'antd/lib/card/Card';
import axios from 'axios';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import jCor from '../../assets/jasonCor.json';
import jMask from '../../assets/jasonMask.json';
import jURL from '../../assets/jasonURLs.json';
import FrameCadButtons, { enBotoes } from '../mine/FrameCadButtons';
import ModalConfirm, { EnRetorno } from './ModalConfirm';

// tentar trabalhar apenas com um elemento de dados

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
  selecaoItem?: any
}

async function buscarNaAPIOsAgendamentosDoMes(value: Moment) {

  const getFiltro = (_primeiro: boolean) => {
    let _retorno = _primeiro ? value.clone().startOf('month') : value.clone().endOf('month');
    return _retorno.format(jMask.mask_data_2)
  }

  let res = await axios.get(_urlPadrao, {
    params: {
      dia_inicial: getFiltro(true),
      dia_final: getFiltro(false)
    }
  })

  let _agrupar_por_data = _.groupBy(res.data, (r: any) => moment(r.date).format(jMask.mask_data_3));

  return _agrupar_por_data;
}

const Agendamento = () => {
  const [dados, setDados] = useState({} as any);
  const [hideNoDia, setHideNoDia] = useState(true);
  const [showModal, setShowModal] = useState(undefined as unknown as IModal)
  //const [selecaoItem, setSelecaoItem] = useState({} as any);
  const [agendamentosDoDia, setAgendamentosDoDia] = useState({} as any)

  const [form_digitacao] = Form.useForm();

  useEffect(() => {
    setHideNoDia(true);

    const fetchData = async () => {
      let dados = await buscarNaAPIOsAgendamentosDoMes(moment(new Date()))
      setDados(dados);
    }

    fetchData().catch(console.error)
  }, []);

  const dateCellRender = (value: Moment) => {
    let formato = value.format(jMask.mask_data_3)
    let agendamentos = _.pick(dados, formato)
    let _style = {
      background: jCor.corAzulClaro,
      padding: '8px',
      margin: '6px',
      borderRadius: '10px',
      color: 'white'
    }

    const ItemLista = (props: any) => {
      const hora_mes = moment(props.data.date).format(jMask.mask_data_4)

      return (
        <Tooltip placement='left' title='Clique para mais detalhes'>
          <p style={_style}>{`${hora_mes} - ${props.data.person}`}</p>
        </Tooltip>
      )
    }

    const onClickCedulaDoCalendario = (agendamento: any) => {
      setAgendamentosDoDia(agendamento)
      setHideNoDia(!hideNoDia)
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

  const SidebarSelecao = () => {
    const onSubmitForm = async () => {
      try {
        let value = await form_digitacao.validateFields();
        let _url = `${_urlPadrao}/${value._id}`
        let res = await axios.patch(_url, value);

        toast.success(res.data.message)

      } catch (error) {
        toast.error("" + error)
      } finally {
        setShowModal({ showModal: EnTipoModal.mIndefinido })
      }
    }

    const Manutencao = (props: any) => {
      form_digitacao.setFieldsValue(showModal?.selecaoItem);

      return <>
        <Card title={props.agendamento.person?.name} size="small" key={`card_${props.agendamento._id}`} style={{ cursor: 'pointer' }} >
          <Row onClick={() => {
            setShowModal({ showModal: EnTipoModal.mManutencao, selecaoItem: props.agendamento })
          }}>
            <Col>
              <Row>
                <Col>Data</Col>
                <Col>{moment(props.agendamento.date).format(jMask.mask_data_1)}</Col>
              </Row>
              <Row>
                <Col>Celular: </Col>
                <Col>{props.agendamento.person?.cellphone}</Col>
              </Row>
            </Col>
          </Row>
          <Tooltip placement='left' title={'Excluir'}>
            <DeleteOutlined
              style={{ color: 'red' }}
              onClick={() => {
                setShowModal({ showModal: EnTipoModal.mAbrirModalConfirmExclusao, selecaoItem: props.agendamento })
              }}
            />
          </Tooltip>
        </Card>
        <Modal
          title={"Manutenção"}
          centered
          open={[EnTipoModal.mManutencao, EnTipoModal.mInclusao].includes(showModal?.showModal)}
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
                <Form.Item label={'ID'} name={'_id'}>
                  <Input disabled={true} />
                </Form.Item>
                {/** exemplo de como mostrar conteudo de sub objetos */}
                <Form.Item label={"Razão"} name={['person', 'name']}>
                  <Input disabled={true} />
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

    return <>
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

  const callbackBotoesPrincipais = (_opcao: enBotoes) => {
    switch (_opcao) {
      case enBotoes.eNovo:
        setShowModal({ showModal: EnTipoModal.mInclusao })
        break;
      case enBotoes.eProcurar:
        setShowModal({ showModal: EnTipoModal.mConsulta })
        break;
    }
  }

  const onExcluir = async (_id: any) => {
    try {
      let res = await axios.delete(`${_urlPadrao}/${_id}`)
      toast.success(res.data.message)
    } catch (error) {
      console.log({ exclusao: error })
      toast.error('Falha ao excluir...')
    } finally {
      setShowModal({ showModal: EnTipoModal.mIndefinido })
    }
  }

  const onCallbackConfirmacao = (opcao: EnRetorno) => {
    switch (opcao) {
      case EnRetorno.clSim:
        onExcluir(showModal.selecaoItem._id)
        break;
      default: {
        setShowModal({ showModal: EnTipoModal.mIndefinido })
      }
    }
  }

  return <>
    <Row justify='end'>
      <FrameCadButtons
        inEdition={false}
        callbackClick={(e: enBotoes) => callbackBotoesPrincipais(e)}
        orientation={'horizontal'}
        invisible={[enBotoes.eAlterar, enBotoes.eExcluir, enBotoes.eGravar, enBotoes.eCancelar]}
      />
    </Row>
    <Row>
      <Col span={hideNoDia ? 0 : 4}>
        <SidebarSelecao />
      </Col>
      <Col span={hideNoDia ? 24 : 20} style={{ padding: '20px' }}>
        <Calendar
          locale={locale}
          dateCellRender={dateCellRender}
          onPanelChange={panelChange}
        />
      </Col>
    </Row>
    <ModalConfirm
      tipo={'excluir'}
      abrir={showModal?.showModal === EnTipoModal.mAbrirModalConfirmExclusao}
      callback={(_opcaoSelecionada: EnRetorno) => { onCallbackConfirmacao(_opcaoSelecionada) }}
    />
    <Modal
      title={"Buscar agendamento"}
      centered
      open={showModal?.showModal === EnTipoModal.mConsulta}
      onOk={() => { }}
      onCancel={() => setShowModal({ showModal: EnTipoModal.mIndefinido })}
      width={800}
      cancelText={"Sair"}
    />
    <ToastContainer />
  </>
};

export default Agendamento;