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

const _urlPadrao = `${jURL.url_api_barber}schedule`

export enum EnTipoModal {
  mIndefinido,
  mConsulta,
  mExclusao,
  mManutencao,
  mAbrirModalConfirmExclusao,
  mInclusao
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
  const [agendamentosNoDia, setAgendamentosNoDia] = useState({} as any);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState({} as any);
  const [showModal, setShowModal] = useState(undefined as unknown as EnTipoModal);
  const [hideNoDia, setHideNoDia] = useState(true);

  useEffect(() => {
    setHideNoDia(true);

    const fetchData = async () => {
      let dados = await buscarNaAPIOsAgendamentosDoMes(moment(new Date()))
      setDados(dados);
    }

    fetchData().catch(console.error)
  }, []);

  useEffect(() => {
    switch (showModal) {
      case EnTipoModal.mExclusao: {

        break;
      }
    }
  }, [showModal]);

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

    const FragListaHTML = (props: any) => {
      const hora_mes = moment(props.data.date).format(jMask.mask_data_4)

      return (
        <Tooltip
          placement='left'
          title='Clique para mais detalhes'>

          <p style={_style}>
            {
              `${hora_mes} - ${props.data.person}`
            }
          </p>
        </Tooltip>
      )
    }

    const onClickCedulaDoCalendario = (agendamento: any) => {
      setAgendamentosNoDia(agendamento)
      setHideNoDia(!hideNoDia)
    }

    return (
      _.map(agendamentos, (agendamento: any) => {
        return <>
          {
            <div style={{ height: '100%' }} onClick={() => onClickCedulaDoCalendario(agendamento)}>
              {
                _.map(agendamento, (a: any) =>
                  <FragListaHTML data={{ person: a.person.name, date: a.date }} key={`fraglist_${a._id}`} />
                )
              }
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

  const FragAgendamentosNoDia = () => {
    const [form_digitacao] = Form.useForm();

    form_digitacao.setFieldsValue(agendamentoSelecionado);

    const onSubmitForm = async () => {
      try {
        let value = await form_digitacao.validateFields();
        let _url = `${_urlPadrao}/${value._id}`
        let res = await axios.patch(_url, value);

        toast.success(res.data.message)

      } catch (error) {
        toast.error("" + error)
      } finally {
        setShowModal(EnTipoModal.mIndefinido)
      }
    }

    const onClickAgendamentoLateral = (agendamento: any) => {
      setShowModal(EnTipoModal.mManutencao)
      setAgendamentoSelecionado(agendamento)
    }

    return <>
      {
        <Space
          direction={'vertical'}
          size={'small'}
          style={{ height: '600px', display: 'flex', overflowY: 'auto' }} >

          <p>
            Incluir o campo de filtro dos agendamentos do dia aqui
          </p>

          {
            _.map(agendamentosNoDia, (agendamento: any) => {
              return <>
                <Tooltip title={`Clique para alterar o agendamento do(a) ${agendamento.person.name}`} placement='right'>
                  <Card
                    title={agendamento.person.name}
                    size="small"
                    key={`card_${agendamento._id}`} >

                    <div
                      key={`div_no_dia_${agendamento._id}`}
                      onClick={() => onClickAgendamentoLateral(agendamento)}
                      style={{ cursor: 'pointer' }}>
                      <p>
                        Data: {moment(agendamento.date).format(jMask.mask_data_1)}
                      </p>
                      <p>
                        Celular: {agendamento.person.cellphone}
                      </p>
                    </div>

                    <Tooltip placement='left' title={'Excluir'}>
                      <DeleteOutlined
                        onClick={() => {
                          setAgendamentoSelecionado(agendamento);
                          setShowModal(EnTipoModal.mAbrirModalConfirmExclusao)
                        }}
                        style={{ color: 'red', cursor: 'pointer' }}
                      />
                    </Tooltip>
                  </Card>
                </Tooltip>
              </>
            })
          }

          <Modal
            title={"Manutenção"}
            centered
            open={[EnTipoModal.mManutencao, EnTipoModal.mInclusao].includes(showModal)}
            onOk={onSubmitForm}
            onCancel={() => setShowModal(EnTipoModal.mIndefinido)}
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
        </Space>
      }
    </>
  }

  const callbackBotoesPrincipais = (_opcao: enBotoes) => {
    switch (_opcao) {
      case enBotoes.eNovo:
        setShowModal(EnTipoModal.mInclusao)
        break;
      case enBotoes.eProcurar:
        setShowModal(EnTipoModal.mConsulta)
        break;
    }
  }

  const callbackConfirmDialog = (_opcao: EnRetorno) => {
    switch (_opcao) {
      case EnRetorno.clSim:
        setShowModal(EnTipoModal.mExclusao)
        break;
      case EnRetorno.clNao:
        setShowModal(EnTipoModal.mIndefinido)
        break;
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
        <FragAgendamentosNoDia />
      </Col>
      <Col span={hideNoDia ? 24 : 20} style={{ padding: '20px' }}>
        <Calendar
          locale={locale}
          dateCellRender={dateCellRender}
          onPanelChange={panelChange}
        />
      </Col>
    </Row>

    <ToastContainer />

    {/** declaração dos modais */}
    <ModalConfirm
      abrir={showModal === EnTipoModal.mAbrirModalConfirmExclusao}
      callback={(e: EnRetorno) => callbackConfirmDialog(e)}
      tipo={'excluir'}
    />

    <Modal
      title={"Buscar agendamento"}
      centered
      open={showModal === EnTipoModal.mConsulta}
      onOk={() => { }}
      onCancel={() => setShowModal(EnTipoModal.mIndefinido)}
      width={800}
      cancelText={"Sair"}
    />
  </>
};

export default Agendamento;