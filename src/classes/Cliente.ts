import _Geral from './_Geral';

export default class Cliente extends _Geral {

    constructor(pValuesJSON: any, pID: string) {
        super('person', pValuesJSON, pID)
    }

}

    /*private static _instance: Cliente;

    public static getInstance(pValuesJSON: any, pID: string) {
        if (this._instance == null) {
            this._instance = new Cliente(pValuesJSON, pID)
        } else {
            return this._instance;
        }
    }*/
