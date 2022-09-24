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

class Agendamento extends React.Component<{}, any> {
  state = {
    schedule: {}
  }

  async componentDidMount(): Promise<void> {
    let res = await getScheduling(moment('2022-09-01'))
    this.setState({ schedule: res.data })
  }

  dateCellRender = (value: Moment) => {
    return (
      <ul>
        {
          _.map(this.state.schedule, (s: any) => {
            return <>
              Extrair o dia aqui
            </>
          })
        }
      </ul>
    );
  }

  onPanelChange = async (value: Moment) => {
    let res = await getScheduling(value)
    this.setState({ agendamentos: res.data })
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

  console.log({ startdate })
  console.log({ enddate })

  let res = await axios.get(`${jconst.url_api_barber}schedule`, {
    params: {
      startdate: startdate,
      enddate: enddate
    }
  })
  console.log({ getScheduling: res.data })
  return res.data;
}
