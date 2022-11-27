import _Geral from './_Geral';

export default class AgendamentoAdapter extends _Geral {
    constructor(pValuesJson: any, pID: string) {
        super('schedule', pValuesJson, pID);
    }
}