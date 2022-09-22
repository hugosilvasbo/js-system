import { Calendar } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import _ from 'lodash';
import { Moment } from 'moment';
import { useState } from 'react';

const Agendamento = () => {
  const [currentDate, setCurrentDate] = useState({
    month: 0,
    year: 0
  })

  const getAgendamentosMensal = (month: any, year: any) => {
    let dados = [
      { name: 'Hugo', day: 1 },
      { name: 'Anderson', day: 21 },
    ]
    return dados
  }

  const dateCellRender = (value: Moment) => {
    let dados_mes;
    const month = value.month()
    const year = value.year()

    if ((currentDate.month !== month) || (currentDate.year !== year)) {
      dados_mes = getAgendamentosMensal(month, year);
      setCurrentDate({ month, year })
    }

    return _.map(dados_mes, (d: any) => {
      return <>
        <li key={value.date() + d.name}>
          {d.name + ' - ' + value.date()}
        </li>
      </>
    })
  }

  return <>
    <Calendar
      locale={locale}
      dateCellRender={dateCellRender}
    />
  </>
};

export default Agendamento;