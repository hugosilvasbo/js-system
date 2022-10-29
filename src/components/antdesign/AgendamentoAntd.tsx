/**
 * @author Hugo S. de Souza <hugosilva.souza@hotmail.com>
 */

import { Calendar, Col, Form, Input, Modal, Row, Space, Typography } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import Card from 'antd/lib/card/Card';
import axios from 'axios';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import jconst from '../../assets/jsConstantes.json';

async function buscarNaAPIOsAgendamentosDoMes(value: Moment) {
  let clone = value.clone()

  let dataInicio = clone.startOf('month').format('YYYY-MM-DD')
  let dataFim = clone.endOf('month').format('YYYY-MM-DD')

  let res = await axios.get(`${jconst.url_api_barber}schedule`, {
    params: {
      startdate: dataInicio,
      enddate: dataFim
    }
  })

  let formato = (r: any) => moment(r.date).format('DDMMYYYY')
  let agrupadoPorDia = _.groupBy(res.data, formato)

  return agrupadoPorDia;
}

const Agendamento = () => {
  const [dados, setDados] = useState({} as any);
  const [agendamentosNoDia, setAgendamentosNoDia] = useState({} as any);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState({} as any);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let dados = await buscarNaAPIOsAgendamentosDoMes(moment(new Date()))
      setDados(dados)
    }

    fetchData().catch(console.error)
  }, [])

  const dateCellRender = (value: Moment) => {
    let data = value.format('DDMMYYYY')
    let agendamentos = _.pick(dados, data)

    const FragListaHTML = (props: any) => {
      const css = { fontSize: '12px', marginBottom: '12px', listStyleType: 'none' }
      const hora_mes = moment(props.date).format('HH:mm:ss')

      return (
        <li key={props._id} style={css}>
          {`${hora_mes} - ${props.person}`}
        </li>
      )
    }

    return (
      _.map(agendamentos, (agendamento: any) =>
        <ul key={agendamento} onClick={() => setAgendamentosNoDia(agendamento)}  >
          {
            _.map(agendamento, (a: any) =>
              <FragListaHTML _id={a._id} person={a.person.name} date={a.date} />
            )
          }
        </ul>
      )
    );
  }

  const FragAgendamentosNoDia = () => {
    const [form_digitacao] = Form.useForm();
    form_digitacao.setFieldsValue(agendamentoSelecionado);

    const onSubmitForm = async () => {
      await form_digitacao.validateFields()
        .then(async (res) => {
          let _url = `${jconst.url_api_barber}schedule/${res._id}`

          console.log({ _url })
          console.log({ res })

          await axios.patch(_url, res)
            .then((res: any) => {
              toast.success(res.message)
            })
            .catch((err: any) => {
              toast.error("Falha na atualização...")
            })
        })
        .catch((err: any) => {
          toast.error("Falha na validação do formulário")
        })
    }

    return <>
      {
        <Space direction={'vertical'} size={'middle'} style={{ display: 'flex' }} >
          {
            _.map(agendamentosNoDia, (agendamento: any) => {
              return <>
                <Card
                  title={agendamento.person.name}
                  size="small"
                  headStyle={{ background: '#f1f1f1' }}
                  onClick={() => {
                    setOpenModal(true)
                    setAgendamentoSelecionado(agendamento)
                  }}>
                  <p>{agendamento.date}</p>
                  <p>{agendamento.cellphone}</p>
                </Card>
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
            <ToastContainer />
          </Modal>
        </Space>
      }
    </>
  }

  return <>
    <Row>
      <Col span={18}>
        <Calendar
          locale={locale}
          dateCellRender={dateCellRender}
          onPanelChange={async (value) => {
            let res = await buscarNaAPIOsAgendamentosDoMes(value)
            setDados(res)
          }}
        />
      </Col>
      <Col span={6} style={{ padding: '1em' }}>
        <Typography.Title style={{ width: '100%', textAlign: 'center', marginBottom: '1em' }} level={5} >
          Agendamento(s) no dia
        </Typography.Title>
        <FragAgendamentosNoDia />
      </Col>
    </Row>
  </>
};

export default Agendamento;