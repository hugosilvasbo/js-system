import _Geral from './_Geral';

export default class Cliente extends _Geral {
    constructor(pValuesJSON: any, pID: string) {
        super('person', pValuesJSON, pID)
    }
}