/**
 * 
 * 
 * ARRUMAR:::
 * - Quando há mais cadastros para o mesmo range de horário.
 * - Exemplo dia 04/11/2022, pois pode haver casos de registros que foram cancelados
 *   e o usuário precisa dessa informação.
 * 
 * 
 * 
 */

import _ from "lodash";
import moment from "moment";
import DateUtils from "./utils/DateUtils";
import _Geral from "./_Geral";

export default class Agendamento extends _Geral {
    constructor(pValuesJson: any, pID: string) {
        super('schedule', pValuesJson, pID);
    }

    /**
     * 
     * @param pScheduleDay -> objeto contendo os agendamentos do mês no formato: 2022-01-01: {0: {...}. 1: {...}}
     * @returns -> Retorna os agendamentos livres e agendados no horário.
     */
    static getSetupDaySchedules(pScheduleDay: any) {
        let _schedules: any = [];
        let _dateKey = "";

        _.forEach(pScheduleDay, (schedule: any, keyDate) => {
            _dateKey = `${keyDate}T00:00:00`;
            _schedules = _.map(schedule, (value: any) => { return { ..._schedules, ...value } });
        });

        console.log({ _schedules: _schedules });


        let jobTime = new Date(_dateKey);
        jobTime.setHours(4, 0, 0, 0);

        let endJobTime = new Date(_dateKey);
        endJobTime.setHours(21, 30, 0, 0);

        let _rangeTime = 30;

        let _hoursAvailable: any = [];

        while (jobTime.getTime() < endJobTime.getTime()) {
            console.log("Horario atual...", moment(jobTime.getTime()).format("HH:mm"));
            console.log("Horario final...", moment(endJobTime.getTime()).format("HH:mm"));

            let _NewRange = _rangeTime;

            // ACHO QUE É AQUI Q TA ZUADO...

            // filtra apenas aqueles que ainda não foram inclusos na tabela.
            /*let _onlyAvailableSchedule = _.filter(_schedules, (schedule: any) => {
                let everIncluded = _.filter(_hoursAvailable, (horario: any) => horario.key === schedule._id);
                return (new Date(schedule.date).getHours() === jobTime.getHours()) && (everIncluded.length <= 0);
            });*/

            // apenas teste........... remover o comentario acima^ Arrumar ele
            console.log(_schedules)
            let _onlyAvailableSchedule = _.filter(_schedules, (schedule: any) => {
                return new Date(schedule.date).getHours() === jobTime.getHours();
            });
            console.log(_onlyAvailableSchedule)
            /////FIM DOP TESTE...NAO TA VINDO OS ITENS

            if (_onlyAvailableSchedule.length > 0) {
                _.map(_onlyAvailableSchedule, (value: any) => {
                    console.log({ _onlyAvailableScheduleMaiorQUEZero: value });

                    let endTime = new Date(value.date_end);

                    _NewRange = DateUtils.obterVariacaoMinutosEntreDatas(jobTime, endTime);

                    _hoursAvailable.push({
                        schedule_time: DateUtils.dateFormatHHmm(new Date(value.date)) + ' à ' + DateUtils.dateFormatHHmm(endTime),
                        client: value.person?.name,
                        situation: value?.situation,
                        key: `li-table-${value._id}`,
                    });

                    jobTime.setTime(endTime.getTime());
                });
            }
            else {
                _hoursAvailable.push({
                    schedule_time: DateUtils.dateFormatHHmm(jobTime),
                    client: "",
                    situation: { description: "Disponível", color: "rgb(195 195 195 / 85%)" },
                    key: new Date().getUTCMilliseconds(),
                });

                jobTime.setMinutes(jobTime.getMinutes() + _NewRange);
            }
        }

        console.log("Fim...")
        return _hoursAvailable;
    }
}