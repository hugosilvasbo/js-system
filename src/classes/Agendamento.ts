import _Geral from "./_Geral";

export default class Agendamento extends _Geral {
    constructor(pValuesJson: any, pID: string) {
        super('schedule', pValuesJson, pID);
    }
}