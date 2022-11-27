export default class ObjectUtils {
    
    public static getObjKey(obj: any, value: any) {
        return Object.keys(obj).find(key => obj[key] === value);
    }
}