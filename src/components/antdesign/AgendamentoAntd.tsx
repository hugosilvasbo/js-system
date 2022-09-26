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

  let first_day_of_month = clone.startOf('month').format('YYYY-MM-DD')
  let last_day_of_month = clone.endOf('month').format('YYYY-MM-DD')

  let res = await axios.get(`${jconst.url_api_barber}schedule`, {
    params: {
      startdate: first_day_of_month,
      enddate: last_day_of_month
    }
  })

  let _groupByDay = _.groupBy(res.data, (r: any) => moment(r.date).format(keyFormat))
  return _groupByDay;
}

class Agendamento extends React.Component<{}, any> {
  state = {
    schedule: {}
  }

  style = { fontSize: '12px', marginBottom: '12px', listStyleType: 'none' }

  async componentDidMount(): Promise<void> {
    let data = await getScheduling(moment('2022-09-01'))
    this.setState({ schedule: data })
  }

  /**
  * Renderiza as células do calendário.
  * Aqui, é feito um filtro pela key (usando o pick), exemplo: 20220910 -> Traz apenas os registros do dia/mês/ano
  * Com isto, é percorrido os elementos e mapeando o mesmo.
  * @function
  * @param {Moment} value - período a ser obtido.
  */
  dateCellRender = (value: Moment) => {
    let key = value.format(keyFormat)
    let scheduleInTheMonth = _.pick(this.state.schedule, key)

    return (
      _.map(scheduleInTheMonth, schedule =>
        <ul key={schedule} onClick={() => console.log({ exemploClique: schedule })}>
          {_.map(schedule, (item: any) => {
            return <li style={this.style}>
              {`${item.date} - ${item.person?.name}`}
            </li>
          })}
        </ul>
      )
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