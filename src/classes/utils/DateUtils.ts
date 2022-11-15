import moment from "moment";

export default class DateUtils {

    public static obterVariacaoMinutosEntreDatas(DtInicial: Date, dtFinal: Date) {
        let _retorno = dtFinal.getTime() - DtInicial.getTime();
        _retorno = Math.round((_retorno / 1000) / 60);

        return _retorno;
    }

    public static dateFormatHHmm(pHorario: any) {
        return moment(pHorario).format("HH:mm");
    }
}