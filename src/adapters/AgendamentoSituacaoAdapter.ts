import _Geral from "./_Geral";

export default class AgendamentoSituacao extends _Geral {
    constructor(pValuesJson: any, pID: string) {
        super('scheduleSituation', pValuesJson, pID);
    }
}