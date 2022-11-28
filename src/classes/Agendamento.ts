import _ from "lodash";
import moment from "moment";
import DateUtils from "./DateUtils";

export default class Agendamento {
    static getSetupDaySchedules(pScheduleDay: any) {
        //-------------------------------------------------------------------------------------------------------------
        //                                              Interfaces
        //-------------------------------------------------------------------------------------------------------------
        interface IPropriedades {
            schedule_time: string,
            client: string,
            scheduleSituation: string,
            key: string,
            hour: number
        }

        interface IVariaveis {
            agendamentos: [],
            retorno: any,
            chaveData: string,
            horarioBase: Date,
            horarioFinalExpediente: Date,
            tempoVariacao: number
        };

        //-------------------------------------------------------------------------------------------------------------
        //                                              Variáveis
        //-------------------------------------------------------------------------------------------------------------
        let _propriedades = {} as IPropriedades;

        let _variaveis = {} as IVariaveis;
        _variaveis.retorno = [];

        //-------------------------------------------------------------------------------------------------------------
        //                                              Funções
        //-------------------------------------------------------------------------------------------------------------

        function preencherHorariosVazios() {
            let inicioExp = _variaveis.horarioBase;

            while (inicioExp.getTime() < _variaveis.horarioFinalExpediente.getTime()) {
                let _inicio = moment(inicioExp.getTime()).format("HH:mm");

                inicioExp.setMinutes(inicioExp.getMinutes() + _variaveis.tempoVariacao);

                _propriedades = {
                    ..._propriedades,
                    schedule_time: `${_inicio} à ${moment(inicioExp.getTime()).format("HH:mm")}`,
                    hour: inicioExp.getTime()
                }

                _variaveis.retorno.push({ ..._propriedades });
            }
        }

        function transformaObjetoAgendamento() {
            _.forEach(pScheduleDay, (schedule: any, keyDate) => {
                let _agendamentos: any = [];

                _agendamentos =
                    _.chain(schedule)
                        .map(value => { return { ..._agendamentos, ...value } })
                        .value();

                _variaveis = {
                    ..._variaveis,
                    agendamentos: _agendamentos,
                    chaveData: `${keyDate}T00:00:00`
                }
            });
        }

        function preencherTempos() {
            _variaveis.chaveData = !_variaveis.agendamentos ? moment(new Date()).format("YYYY-MM-DDT00:00:00") : _variaveis.chaveData;

            // Por enquanto fixo, mas precisa buscar da api o horario de inicio e fim
            let _inicio = new Date(_variaveis.chaveData);
            _inicio.setHours(16, 30, 0, 0);

            let _fim = new Date(_variaveis.chaveData);
            _fim.setHours(23, 0, 0, 0);

            const _tempoVariacao = 30;

            _variaveis = {
                ..._variaveis,
                horarioBase: _inicio,
                horarioFinalExpediente: _fim,
                tempoVariacao: _tempoVariacao, // buscar depois...
            }
        }

        //-------------------------------------------------------------------------------------------------------------
        //                                            Começa aqui...
        //-------------------------------------------------------------------------------------------------------------

        transformaObjetoAgendamento();

        preencherTempos();

        if (!_variaveis.agendamentos) {
            preencherHorariosVazios();
        } else {
            _.forEach(_variaveis.agendamentos, (value: any) => {
                let horaInicialDoAgendamento = new Date(value.date)

                // vejo quantos minutos de variação tem entre o horario atual do loop e o horario inicial do agendamento 
                // portanto, só é feito se nao for a situação Cancelado.
                let minutos_variacao = 0;

                // se for cancelado, nao deve entrar no cálculo de horário
                if (value.scheduleSituation?.description !== "Cancelado")
                    minutos_variacao = DateUtils.obterVariacaoMinutosEntreDatas(_variaveis.horarioBase, horaInicialDoAgendamento);

                // e com isso, vou preenchendo os intervalores vagos com os horários livres
                while (minutos_variacao > 0) {
                    _propriedades = {
                        ..._propriedades,
                        hour: _variaveis.horarioBase.getTime(),
                        schedule_time: `${moment(_variaveis.horarioBase.getTime()).format("HH:mm")} à `
                    }

                    // para separar de tempo em tempo de variação
                    if (minutos_variacao > _variaveis.tempoVariacao || minutos_variacao === 0) {
                        _variaveis.horarioBase.setMinutes(_variaveis.horarioBase.getMinutes() + _variaveis.tempoVariacao);
                    } else {
                        _variaveis.horarioBase.setMinutes(_variaveis.horarioBase.getMinutes() + minutos_variacao);
                    }

                    _propriedades = {
                        ..._propriedades,
                        schedule_time: `${_propriedades.schedule_time} ${moment(_variaveis.horarioBase.getTime()).format("HH:mm")}`,
                        key: _variaveis.horarioBase.getDate().toString()
                    }

                    _variaveis.retorno.push({ ..._propriedades })

                    minutos_variacao = minutos_variacao - _variaveis.tempoVariacao;
                }

                //** só dai eu posso incluir o agendamento */
                let dataFinal = new Date(value.date_end);

                _variaveis.retorno.push({
                    schedule_time: moment(horaInicialDoAgendamento).format("HH:mm") + ' à ' + moment(dataFinal).format("HH:mm"),
                    client: value.person?.name,
                    scheduleSituation: value?.scheduleSituation,
                    key: `li-table-${value._id}`,
                    hour: horaInicialDoAgendamento.getTime()
                });

                // @@@@@@ tratar isso aqui com algum combobox, para incrementar os horarios apenas se nao for situaçoes
                // que nao interferem no horario
                // E quando a situaçao do horario nao é para considerar no calculo de minutos, nada é feito.
                if (value?.scheduleSituation?.description !== 'Cancelado') {
                    _variaveis.horarioBase.setTime(dataFinal.getTime());
                }
            });

            // No final, preenchemos o restante dos horários livres até o horario final do expediente.
            preencherHorariosVazios();
        }

        return _.chain(_variaveis.retorno).orderBy(["hour"], ["asc"]).value();
    }
}