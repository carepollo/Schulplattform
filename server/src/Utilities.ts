export default class Utilities {

    constructor() {}

    //quita los elementos de un array unidimensional
    static removeDuplicates(array:any[]): any[] {
        var list:any = []
        for(let e = 0; e < array.length; e++){
            if (list.includes(array[e])) {
                continue
            }
            else {
                list.push(array[e])
            }
        }
        return list
    }

}