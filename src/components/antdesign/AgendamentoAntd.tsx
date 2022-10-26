/**
 * @author Hugo S. Souza <hugosilva.souza@hotmail.com>
 */

import { Calendar, Modal, Row } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import axios from 'axios';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import React from 'react';
import jconst from '../../assets/jsConstantes.json';

/**
 * Obtém os agendamentos do mês agrupados por data (DDMMYYYY).
 * @function
 * @param {Moment} value - período a ser obtido.
 */
async function obterAgendamentosDoMes(value: Moment) {
  let clone = value.clone()

  let data_inicial = clone.startOf('month').format('YYYY-MM-DD')
  let data_final = clone.endOf('month').format('YYYY-MM-DD')

  let res = await axios.get(`${jconst.url_api_barber}schedule`, {
    params: {
      startdate: data_inicial,
      enddate: data_final
    }
  })

  let formatado_do_grupo = (r: any) => moment(r.date).format('DDMMYYYY')
  let objeto_agrupado_por_dia = _.groupBy(res.data, formatado_do_grupo)

  return objeto_agrupado_por_dia;
}

class Agendamento extends React.Component<{}, any> {
  state = {
    schedule: {}
  }

  async componentDidMount(): Promise<void> {
    let data = await obterAgendamentosDoMes(moment(new Date()))
    this.setState({ schedule: data })
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

  abrirDetalhes(dados_do_dia: any) {
    console.log({ dados_do_dia })
  }

  /**
  * Renderiza as células do calendário.
  * @function
  * @param {Moment} value - período a ser obtido.
  */
  dateCellRender = (value: Moment) => {
    let data_mascarada = value.format('DDMMYYYY')
    let agendamento_no_dia = _.pick(this.state.schedule, data_mascarada)

    return (
      _.map(agendamento_no_dia, (no_dia: any) =>
        <ul key={no_dia} onClick={() => this.abrirDetalhes(no_dia)}>{
          _.map(no_dia, (i: any) => <this.ListaHTML _id={i._id} person={i.person.name} date={i.date} />)
        }</ul>)
    );
  }

  onPanelChange = async (value: Moment) => {
    let res = await obterAgendamentosDoMes(value)
    this.setState({ schedule: res })
  }

  render() {
    return <>
      <Row>
        <Calendar
          locale={locale}
          dateCellRender={this.dateCellRender}
          onPanelChange={this.onPanelChange}
        />
        <div>
          Trazer as informações do dia aqui...
          no lado esquerdo, e quando clicar sobre,
          abrir um modal com o detalhamento
        </div>
      </Row>
    </>
  }
};

export default Agendamento;