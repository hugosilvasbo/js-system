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
import FrameCadButtons from '../mine/FrameCadButtons';
import ModalConfirm from './ModalConfirm';

async function buscarNaAPIOsAgendamentosDoMes(value: Moment) {
  let clone = value.clone()

  let dataInicio = clone.startOf('month').format(jMask.mask_data_2)
  let dataFim = clone.endOf('month').format(jMask.mask_data_2)

  let res = await axios.get(`${jURL.url_api_barber}schedule`, {
    params: {
      startdate: dataInicio,
      enddate: dataFim
    }
  })

  let formato = (r: any) => moment(r.date).format(jMask.mask_data_3)
  let agrupadoPorDia = _.groupBy(res.data, formato)

  return agrupadoPorDia;
}

const Agendamento = () => {
  const [dados, setDados] = useState({} as any);
  const [agendamentosNoDia, setAgendamentosNoDia] = useState({} as any);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState({} as any);
  const [openModal, setOpenModal] = useState(false);
  const [openModalConsulta, setOpenModalConsulta] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [hideNoDia, setHideNoDia] = useState(true);

  useEffect(() => {
    setHideNoDia(true);

    const fetchData = async () => {
      let dados = await buscarNaAPIOsAgendamentosDoMes(moment(new Date()))
      setDados(dados);
    }

    fetchData().catch(console.error)
  }, []);

  const dateCellRender = (value: Moment) => {
    let data = value.format(jMask.mask_data_3)
    let agendamentos = _.pick(dados, data)
    let _style = {
      background: jCor.corAzulClaro,
      padding: '8px',
      margin: '6px',
      borderRadius: '10px',
      color: 'white'
    }

    const FragListaHTML = (props: any) => {
      const hora_mes = moment(props.date).format(jMask.mask_data_4)
      let _conteudo = `${hora_mes} - ${props.person}`;

      return (
        <Tooltip
          placement='left'
          title='Clique para mais detalhes'>

          <p style={_style}>
            {_conteudo}
          </p>
        </Tooltip>
      )
    }

    return (
      _.map(agendamentos, (agendamento: any) => {
        return <>
          {
            <div
              style={{ height: 'auto' }}
              onClick={() => {
                setAgendamentosNoDia(agendamento)
                setHideNoDia(!hideNoDia)
              }
              }>
              {
                _.map(agendamento, (a: any) =>
                  <FragListaHTML
                    _id={a._id}
                    person={a.person.name}
                    key={`fraglist_${a._id}`}
                    date={a.date} />
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
        let _url = `${jURL.url_api_barber}schedule/${value._id}`
        let res = await axios.patch(_url, value);

        toast.success(res.data.message)

      } catch (error) {
        toast.error("" + error)
      } finally {
        setOpenModal(false)
      }
    }

    const clickSobOAgendamento = (agendamento: any) => {
      setOpenModal(true)
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
              let _conteudo = <>
                <p>
                  Data: {moment(agendamento.date).format(jMask.mask_data_1)}
                </p>
                <p>
                  Celular: {agendamento.person.cellphone}
                </p>
              </>

              const _deleteIcon = <>
                <DeleteOutlined
                  onClick={() => setOpenConfirmDelete(true)}
                  style={{ color: 'red', cursor: 'pointer' }} />
              </>

              return <>
                <Tooltip
                  title={`Clique para alterar o agendamento do(a) ${agendamento.person.name}`}
                  placement='right'>

                  <Card
                    title={agendamento.person.name}
                    size="small"
                    key={`card_${agendamento._id}`}>

                    <div
                      key={`div_no_dia_${agendamento._id}`}
                      onClick={() => clickSobOAgendamento(agendamento)}
                      style={{ cursor: 'pointer' }}>
                      {_conteudo}
                    </div>

                    <Tooltip placement='left' title={'Excluir'}>
                      {_deleteIcon}
                    </Tooltip>
                  </Card>

                </Tooltip>
              </>
            })
          }

          <Modal
            title={"Manutenção"}
            centered
            open={openModal}
            onOk={onSubmitForm}
            onCancel={() => setOpenModal(false)}
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

  const excluirAgendamento = () => {
    console.log("Excluir agendamento")
  }

  return <>
    <Row justify='end'>
      <FrameCadButtons
        inEdition={false}
        onClickNew={() => { setOpenModal(true) }}
        onClickSearch={() => setOpenModalConsulta(true)}
        orientation={'horizontal'}
      />
    </Row>
    <Row>
      <Col span={hideNoDia ? 0 : 4}>
        <FragAgendamentosNoDia />
      </Col>
      <Col span={hideNoDia ? 24 : 20} style={{ padding: '10px' }}>
        <Calendar
          locale={locale}
          dateCellRender={dateCellRender}
          onPanelChange={panelChange}
        />
      </Col>
    </Row>
    <ToastContainer />
    <ModalConfirm
      abrir={openConfirmDelete}
      clickOnOK={() => excluirAgendamento()}
      clickOnCancel={() => { setOpenConfirmDelete(false) }}
      tipo={'excluir'}
      observacao={'Ao continuar, a ação não poderá ser desfeita.'}
    />
    <Modal
      title={"Buscar agendamento"}
      centered
      open={openModalConsulta}
      onOk={() => { }}
      onCancel={() => setOpenModalConsulta(false)}
      width={800}
      cancelText={"Sair"}
    />
  </>
};

export default Agendamento;