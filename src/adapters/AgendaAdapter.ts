import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { Moment } from 'moment';
import _Geral from './_Geral';

export default class AgendamentoAdapter extends _Geral {
    constructor(pValuesJson: any, pID: string) {
        super('schedule', pValuesJson, pID);
    }

    async getSchedulesInMonth(value: Moment) {

        function getFilter(firstData: boolean) {
            let _clone = value.clone();
            return (firstData ? _clone.startOf('month') : _clone.endOf('month')).format("YYYY-MM-DD");
        }

        let res = await axios.get(this.url, {
            params: {
                date: getFilter(true),
                date_end: getFilter(false)
            }
        });

        let groupByDate = _.groupBy(res.data, (r: any) => moment(r.date).format("YYYY-MM-DD"));

        return groupByDate;
    }
}