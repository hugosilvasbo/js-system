/**
 * @author Hugo S. Souza <hugosilva.souza@hotmail.com>
 */

import { Calendar, Col, Row, Space, Typography } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import Card from 'antd/lib/card/Card';
import axios from 'axios';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import React from 'react';
import jconst from '../../assets/jsConstantes.json';

async function obterAgendamentosDoMes(value: Moment) {
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
    agendamentosNoDia: {}
  }

  async componentDidMount(): Promise<void> {
    let data = await obterAgendamentosDoMes(moment(new Date()))
    this.setState({ dados: data })
  }

  ListaHTML = (props: any) => {
    const estilo_css = { fontSize: '12px', marginBottom: '12px', listStyleType: 'none' }
    const hora_mes = moment(props.date).format('HH:mm:ss')

    return (
      <li key={props._id} style={estilo_css}>
        {`${hora_mes} - ${props.person}`}
      </li>
    )
  }

  dateCellRender = (value: Moment) => {
    let data = value.format('DDMMYYYY')
    let agendamentos = _.pick(this.state.dados, data)

    return (
      _.map(agendamentos, (agendamento: any) =>
        <ul key={agendamento} onClick={() => this.setState({ agendamentosNoDia: agendamento })}>{
          _.map(agendamento, (i: any) => <this.ListaHTML _id={i._id} person={i.person.name} date={i.date} />)
        }</ul>)
    );
  }

  onPanelChange = async (value: Moment) => {
    let res = await obterAgendamentosDoMes(value)
    this.setState({ dados: res })
  }

  DetalhesDoDia() {
    return _.map(this.state.agendamentosNoDia, (agendamento: any) => {
      return agendamento._id
    })
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
          <Typography.Title style={{ width: '100%', textAlign: 'center', marginBottom: '1em' }} level={5}>
            Agendamento(s) no dia
          </Typography.Title>
          <Space direction={'vertical'} size={'middle'} style={{ display: 'flex' }}>
            {
              _.map(this.state.agendamentosNoDia, (agendamento: any) => {
                return <>
                  <Card title={agendamento.person.name} size="small">
                    <p>{agendamento.date}</p>
                    <p>{agendamento.cellphone}</p>
                  </Card>
                </>
              })
            }
          </Space>
        </Col>
      </Row>
    </>
  }
};

export default Agendamento;