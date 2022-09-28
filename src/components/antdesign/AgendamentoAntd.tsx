/**
 * @author Hugo S. Souza <hugosilva.souza@hotmail.com>
 */

import { Calendar } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import axios from 'axios';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import React from 'react';
import jconst from '../../assets/jsConstantes.json';

const keyFormat = 'DDMMYYYY'

/**
 * Obtém os agendamentos do mês agrupados por data (DDMMYYYY).
 * @function
 * @param {Moment} value - período a ser obtido.
 */
async function getScheduling(value: Moment) {
  let clone = value.clone()

  let ini = clone.startOf('month').utc().format('YYYY-MM-DD')
  let fim = clone.endOf('month').utc().format('YYYY-MM-DD')

  let res = await axios.get(`${jconst.url_api_barber}schedule`, {
    params: {
      startdate: ini,
      enddate: fim
    }
  })

  let _groupformat = (r: any) => moment(r.date).utc().format(keyFormat)
  let _groupByDay = _.groupBy(res.data, _groupformat)

  return _groupByDay;
}

class Agendamento extends React.Component<{}, any> {
  state = {
    schedule: {}
  }

  style = {
    fontSize: '12px',
    marginBottom: '12px',
    listStyleType: 'none'
  }

  async componentDidMount(): Promise<void> {
    let firstMoment = moment('2022-09-01')
    let data = await getScheduling(firstMoment)
    this.setState({ schedule: data })
  }

  ListGuy = (props: any) => {
    const time = moment(props.date).utc().format('HH:mm:ss')
    return (
      <li style={this.style}> {`${time} - ${props.person}`} </li>
    )
  }

  /**
  * Renderiza as células do calendário.
  * @function
  * @param {Moment} value - período a ser obtido.
  */
  dateCellRender = (value: Moment) => {
    let formatado_data = value.utc().format(keyFormat)
    let agendamentosNoDia = _.pick(this.state.schedule, formatado_data)

    return (
      _.map(agendamentosNoDia, (dia: any) =>
        <ul key={dia} onClick={() => { console.log(dia) }}>{
          _.map(dia, (i: any) => <this.ListGuy person={i.person.name} date={i.date} />)
        }</ul>)
    );
  }

  onPanelChange = async (value: Moment) => {
    let data = await getScheduling(value)
    this.setState({ agendamentos: data })
  }

  render() {
    return <>
      <Calendar
        locale={locale}
        dateCellRender={this.dateCellRender}
        onPanelChange={this.onPanelChange}
      />
    </>
  }
};

export default Agendamento;