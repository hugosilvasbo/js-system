import _Geral from "./_Geral";

export default class Funcionario extends _Geral {

    constructor(pValuesJSON: any, pID: string) {
        super('employee', pValuesJSON, pID)
    }
}