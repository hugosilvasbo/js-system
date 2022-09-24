/**
 * Anotações:
 * - O mês do componente começa do 0 (Janeiro) à 12 (Dezembro)
 */

import { Calendar } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { Moment } from 'moment';
import React from 'react';
import jconst from '../../assets/jsConstantes.json'

class Agendamento extends React.Component<{}, any> {
  state = {
    schedule: getScheduling(moment('2022-09-01'))
  }

  dateCellRender = (value: Moment) => {
    return (
      <ul>
        {
          _.map(this.state.schedule, (item: any) => {
            return <>
              <li>
                {item.name}
              </li>
            </>
          })
        }
      </ul>
    );
  }

  onPanelChange = (value: Moment) => {
    this.setState({ agendamentos: getScheduling(value) })
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
  let res = await axios.get(`${jconst.url_api_barber}schedule`, {
    params: {
      date: value.date()
    }
  })
  console.log({ res })
}
