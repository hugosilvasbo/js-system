/**
 * @author Hugo S. de Souza <hugosilva.souza@hotmail.com>
 */

import { Calendar, Col, Form, Input, Modal, Row, Space, Typography } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import Card from 'antd/lib/card/Card';
import axios from 'axios';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import React from 'react';
import jconst from '../../assets/jsConstantes.json'

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

class Agendamento extends React.Component<{}, any> {
  state = {
    dados: {},
    agendamentosNoDia: {} as any,
    agendamentoSelecionado: {} as any,
    modal: {
      openModal: false
    }
  }

  async componentDidMount(): Promise<void> {
    let data = await buscarNaAPIOsAgendamentosDoMes(moment(new Date()));
    this.setState({ dados: data });
  }

  dateCellRender = (value: Moment) => {
    let data = value.format('DDMMYYYY')
    let agendamentos = _.pick(this.state.dados, data)

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
        <ul key={agendamento} onClick={() => this.setState({ agendamentosNoDia: agendamento })}  >
          {_.map(agendamento, (a: any) =>
            <FragListaHTML
              _id={a._id}
              person={a.person.name}
              date={a.date}
            />
          )}
        </ul>
      )
    );
  }

  onPanelChange = async (value: Moment) => {
    let res = await buscarNaAPIOsAgendamentosDoMes(value);
    this.setState({ dados: res })
  }

  FragAgendamentosNoDia = () => {
    const stateSelecionado = this.state.agendamentoSelecionado;
    const stateModal = this.state.modal;
    const stateAgendadoNoDia = this.state.agendamentosNoDia;

    const [form_digitacao] = Form.useForm();
    form_digitacao.setFieldsValue(stateSelecionado);

    const onSubmitForm = async () => {
      form_digitacao.validateFields()
        .then(async (value: any) => {
          let res = await axios.post(`${jconst.url_api_barber}schedule`, value)
            .then((value: any) => {
              console.log({ resultadoAPI: value })
            })
            .catch((reason: any) => {
              console.log({ falha: reason });
            })
        });
    }

    return <>
      {
        <Space direction={'vertical'} size={'middle'} style={{ display: 'flex' }} >
          {
            _.map(stateAgendadoNoDia, (agendamento: any) => {
              return <>
                <Card
                  title={agendamento.person.name}
                  size="small"
                  headStyle={{ background: '#f1f1f1' }}
                  onClick={() => { this.setState({ modal: { openModal: true, }, agendamentoSelecionado: agendamento }) }}
                >
                  <p>{agendamento.date}</p>
                  <p>{agendamento.cellphone}</p>
                </Card>
              </>
            })
          }
          <Modal
            title={"Manutenção"}
            centered
            open={stateModal.openModal}
            onOk={onSubmitForm}
            onCancel={() => this.setState({ modal: { openModal: false } })}
            width={1000}
            okText={"Gravar"}
            cancelText={"Sair"}
          >
            <Form form={form_digitacao} layout={"vertical"}>
              <Row>
                <Col span={24} >
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

  render() {
    return <>
      <Row>
        <Col span={18}>
          <Calendar
            locale={locale}
            dateCellRender={this.dateCellRender}
            onPanelChange={this.onPanelChange}
          />
        </Col>
        <Col span={6} style={{ padding: '1em' }}>
          <Typography.Title style={{ width: '100%', textAlign: 'center', marginBottom: '1em' }} level={5} >
            Agendamento(s) no dia
          </Typography.Title>
          <this.FragAgendamentosNoDia />
        </Col>
      </Row>
    </>
  }
};

export default Agendamento;