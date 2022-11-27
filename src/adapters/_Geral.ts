import axios from 'axios';
import jsonURL from '../assets/jasonURLs.json';

export default abstract class _Geral {
    public url: string;
    public valuesJSON: any;
    public _id: string;

    constructor(pEndPointName: string, pValuesJson: any, pID: string) {
        this.url = `${jsonURL.url_api_barber}${pEndPointName}/`;
        this.valuesJSON = pValuesJson;
        this._id = pID;
    }

    async send() {
        let res = null;
        this._id ?
            res = await axios.patch(this.url + this._id, this.valuesJSON) :
            res = await axios.post(this.url, this.valuesJSON);

        return res;
    }

    async delete() {
        let res = await axios.delete(this.url + this._id);
        return res;
    }

    /** pendência: tratar quando possui parâmetros de filtragem.
     * exemplo: agendamento
     */
    async loadAll() {
        let res = await axios.get(this.url);
        //console.log({ geralts_res: res })
        return res;
    }
}