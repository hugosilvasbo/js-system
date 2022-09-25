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

const _groupBy = 'DDMMYYYY'

/**
 * Obtém os agendamentos do mês agrupados por data.
 * @function
 * @param {Moment} value - período a ser obtido.
 */
async function getScheduling(value: Moment) {
  let clone = value.clone()
  let start = clone.startOf('month').format('YYYY-MM-DD')
  let end = clone.endOf('month').format('YYYY-MM-DD')

  let res = await axios.get(`${jconst.url_api_barber}schedule`, {
    params: {
      startdate: start,
      enddate: end
    }
  })

  return _.groupBy(res.data, (r: any) => moment(r.date).format(_groupBy));
}

class Agendamento extends React.Component<{}, any> {
  state = {
    schedule: {}
  }

  async componentDidMount(): Promise<void> {
    let data = await getScheduling(moment('2022-09-01'))
    this.setState({ schedule: data })
  }

  dateCellRender = (value: Moment) => {
    let key = value.format(_groupBy)

    // exemplo: key = 21092022
    // no objeto agrupado por data, fazemos o filtro pela key
    // trazendo apenas os resultados do dia
    let inDay = _.pick(this.state.schedule, key)
    console.log(inDay)

    return (
      <ul>
        {
         
        }
      </ul>

      /*_.map(this.state.schedule, (s: ISchedule) => {
      let _date = moment(s.date).format('DD/MM/YYYY')
    let _value = value.format('DD/MM/YYYY')

    return <>
      {
        _date === _value &&
        <li style={{ fontSize: '12px', marginBottom: '9px' }}>
          {s.date + ': ' + s.person.name}
        </li>
      }
    </>
      })
    }*/

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