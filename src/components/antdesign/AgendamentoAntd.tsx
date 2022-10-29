/**
 * @author Hugo S. de Souza <hugosilva.souza@hotmail.com>
 */

import { Calendar, Col, Form, Input, Modal, Row, Space, Tooltip } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import Card from 'antd/lib/card/Card';
import axios from 'axios';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import jURL from '../../assets/jasonURLs.json';
import jMask from '../../assets/jasonMask.json';
import jCor from '../../assets/jasonCor.json';
import FrameCadButtons from '../mine/FrameCadButtons';

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
  const [hideNoDia, setHideNoDia] = useState(false);

  useEffect(() => {
    setHideNoDia(true);

    const fetchData = async () => {
      let dados = await buscarNaAPIOsAgendamentosDoMes(moment(new Date()))
      setDados(dados);
    }

    fetchData().catch(console.error)
  }, [])

  const dateCellRender = (value: Moment) => {
    let data = value.format(jMask.mask_data_3)
    let agendamentos = _.pick(dados, data)

    const FragListaHTML = (props: any) => {
      const hora_mes = moment(props.date).format(jMask.mask_data_4)

      return (
        <li key={props._id} style={{ fontSize: '12px' }}>
          {`${hora_mes} - ${props.person}`}
        </li>
      )
    }

    return (
      _.map(agendamentos, (agendamento: any) => {
        return <>
          {
            <div style={{ height: '100%' }} onClick={() => setAgendamentosNoDia(agendamento)}>
              {
                _.map(agendamento, (a: any) =>
                  <FragListaHTML _id={a._id} person={a.person.name} date={a.date} />
                )
              }
            </div>
          }
        </>
      }
      )
    );
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
      }
    }

    return <>
      {
        <Card
          title={"Atual"}
          headStyle={{ background: jCor.corAzulEscuro, color: 'white' }}
        >
          <Space direction={'vertical'} size={'small'} style={{ display: 'flex' }} >
            {
              _.map(agendamentosNoDia, (agendamento: any) => {
                console.log({ selecionad2: agendamento })
                return <>
                  <Tooltip
                    key={'tool_' + agendamento._id}
                    placement='bottomRight'
                    title='Clique para alterar'>

                    <Card
                      title={agendamento.person.name}
                      size="small"
                      key={agendamento._id}
                      onClick={() => {
                        setOpenModal(true)
                        setAgendamentoSelecionado(agendamento)
                      }}>
                      <p>Data: {moment(agendamento.date).format(jMask.mask_data_1)}</p>
                      <p>Celular: {agendamento.person.cellphone}</p>
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
              width={1000}
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
        </Card>
      }
    </>
  }

  return <>
    <Row justify='end'>
      <FrameCadButtons
        inEdition={false}
        onClickNew={() => { }}
        onClickSearch={() => setOpenModalConsulta(true)}
        onClickEdit={() => setHideNoDia(!hideNoDia)}
        orientation={'horizontal'}
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
    </Row>
    <Row>
      <Col hidden={hideNoDia} span={4} style={{ padding: '10px' }}>
        <FragAgendamentosNoDia />
      </Col>
      <Col span={hideNoDia ? 24 : 20}>
        <Calendar
          locale={locale}
          dateCellRender={dateCellRender}
          onPanelChange={async (value) => {
            let res = await buscarNaAPIOsAgendamentosDoMes(value)
            setDados(res)
          }}
        />
      </Col>
    </Row>
    <ToastContainer />
  </>
};

export default Agendamento;