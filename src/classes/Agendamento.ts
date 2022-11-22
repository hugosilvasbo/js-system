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
        interface IPropriedades {
            schedule_time: string,
            client: string,
            situation: string,
            key: string,
            hour: number
        }

        /**
         * Preenche os horários vazios faltantes.
         */
        function preencherHorariosVazios() {
            while (inicioExp.getTime() < finalExp.getTime()) {
                let _inicio = moment(inicioExp.getTime()).format("HH:mm");

                inicioExp.setMinutes(inicioExp.getMinutes() + tempoVariacao);

                _propriedades = {
                    ..._propriedades,
                    schedule_time: `${_inicio} à ${moment(inicioExp.getTime()).format("HH:mm")}`,
                    hour: inicioExp.getTime()
                }

                _result.push({ ..._propriedades });
            }
        }

        /**
         * Cria o objeto no padrão a ser utilizado aqui
         */
        function transformaObjetoAgendamento() {
            _.forEach(pScheduleDay, (schedule: any, keyDate) => {
                _chaveData = `${keyDate}T00:00:00`;

                _agendamentos =
                    _.chain(schedule)
                        //.orderBy(["date", "date_end"], ["asc", "asc"])
                        .map(value => { return { ..._agendamentos, ...value } })
                        .value();
            });
        }

        function retornarTempoDeVariacao() {
            return 30; // buscar do banco depois...
        }

        let _agendamentos: any = [];
        let _result: any = [];
        let _chaveData = "";

        transformaObjetoAgendamento();

        //@@@@@@@@
        // precisa passar o dia clicado tbm... tratar quando nao ha agendamentos..
        //_chaveData = "2022-11-05T00:00:00";

        let inicioExp = new Date(_chaveData);
        inicioExp.setHours(8, 0, 0, 0);

        let finalExp = new Date(_chaveData);
        finalExp.setHours(23, 59, 0, 0);

        let tempoVariacao = retornarTempoDeVariacao();
        /**
         * Inicio do processo que geramos os horários...
         */
        //while (inicioExp.getTime() < finalExp.getTime()) {
        let _propriedades = {} as IPropriedades;

        if (_agendamentos.length <= 0) {
            preencherHorariosVazios();
        } else {
            _.forEach(_agendamentos, (value: any) => {
                let horaInicialDoAgendamento = new Date(value.date)

                // vejo quantos minutos de variação tem entre o horario atual do loop e o horario inicial do agendamento 
                // portanto, só é feito se nao for a situação Cancelado.
                let minutos_variacao = 0;

                if (value.situation.description !== "Cancelado")
                    minutos_variacao = DateUtils.obterVariacaoMinutosEntreDatas(inicioExp, horaInicialDoAgendamento);

                // e com isso, vou preenchendo os intervalores vagos com os horários livres
                while (minutos_variacao > 0) {
                    _propriedades = {
                        ..._propriedades,
                        hour: inicioExp.getTime(),
                        schedule_time: `${moment(inicioExp.getTime()).format("HH:mm")} à `,
                        situation: "Disponível"
                    }

                    if (minutos_variacao > tempoVariacao || minutos_variacao === 0) {
                        inicioExp.setMinutes(inicioExp.getMinutes() + tempoVariacao);
                    } else {
                        inicioExp.setMinutes(inicioExp.getMinutes() + minutos_variacao);
                    }

                    _propriedades = {
                        ..._propriedades,
                        schedule_time: `${_propriedades.schedule_time} ${moment(inicioExp.getTime()).format("HH:mm")}`,
                        key: inicioExp.getDate().toString()
                    }

                    _result.push({ ..._propriedades });

                    minutos_variacao = minutos_variacao - tempoVariacao;
                }

                //** só dai eu posso incluir o agendamento */
                let dataFinal = new Date(value.date_end);

                _result.push({
                    schedule_time: moment(horaInicialDoAgendamento).format("HH:mm") + ' à ' + moment(dataFinal).format("HH:mm"),
                    client: value.person?.name,
                    situation: value?.situation,
                    key: `li-table-${value._id}`,
                    hour: horaInicialDoAgendamento.getTime()
                });

                // @@@@@@ tratar isso aqui com algum combobox, para incrementar os horarios apenas se nao for situaçoes
                // que nao interferem no horario
                // E quando a situaçao do horario nao é para considerar no calculo de minutos, nada é feito.
                if (value?.situation?.description !== 'Cancelado') {
                    inicioExp.setTime(dataFinal.getTime());
                }
            });

            // No final, preenchemos o restante dos horários livres até o horario final do expediente.
            preencherHorariosVazios();
        }

        return _.chain(_result).orderBy(["hour"], ["asc"]).value();
    }
}