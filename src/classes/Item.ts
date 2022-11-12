import _Geral from "./_Geral";

export default class Item extends _Geral {
    constructor(pValuesJSON: any, pID: string) {
        super('product', pValuesJSON, pID)
    }
}