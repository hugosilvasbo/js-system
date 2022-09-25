/**
 * Anotações:
 * - O mês do componente começa do 0 (Janeiro) à 12 (Dezembro)
 */

import { Calendar } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import axios from 'axios';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import React from 'react';
import jconst from '../../assets/jsConstantes.json';

interface ISchedule {
  date: string,
  person: any
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
    return (
      <ul>
        {
          _.map(this.state.schedule, (s: ISchedule) => {
            let _date = moment(s.date).format('DD-MM-YYYY')
            let _value = value.format('DD-MM-YYYY')

            return <>
              {
                _date == _value && <li>{_date + '-' + s.person.name}</li>
              }
            </>
          })
        }
      </ul>
    );
  }

  onPanelChange = async (value: Moment) => {
    let data = await getScheduling(value)
    console.log({ onPanelChange: 'onPanelChange' })
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

async function getScheduling(value: Moment) {
  let clone = value.clone()

  let startdate = clone.startOf('month').format('YYYY-MM-DD')
  let enddate = clone.endOf('month').format('YYYY-MM-DD')

  let res = await axios.get(`${jconst.url_api_barber}schedule`, {
    params: {
      startdate: startdate,
      enddate: enddate
    }
  })

  console.log('getScheduling...')
  return res.data;
}
