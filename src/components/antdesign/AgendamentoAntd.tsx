/**
 * Anotações:
 * - A colega do mês no componente começa do 0 (Janeiro) à 12 (Dezembro)
 */

import { Calendar } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import _ from 'lodash';
import { Moment } from 'moment';
import React from 'react';

class Agendamento extends React.Component<{}, any> {
  state = {
    agendamentos: obterAgendamentos(11, 2022)
  }

  dateCellRender = (value: Moment) => {
    console.log('CellRender')
    return (
      <ul>
        {
          _.map(this.state.agendamentos, (item: any) => {
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
    console.log('onPanelChange... Teste alternando a data! :) ... Mês > ' + value.month())
    this.setState({ agendamentos: obterAgendamentos(value.month(), value.year()) })
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

function obterAgendamentos(mes: number, ano: number) {
  mes += 1

  // teste...
  // fazer a busca na api dos dados, manipular e retornar para o componente! =)
  if (mes === 1) {
    return [
      { _id: '123123', name: 'Hugo', day: 1 },
      { _id: '334342', name: 'Anderson', day: 21 }
    ]
  } else {
    return [
      { _id: '9999', name: 'Zezinha', day: 8 }
    ]
  }
}
