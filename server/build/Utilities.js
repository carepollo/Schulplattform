"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utilities {
    constructor() { }
    //confirma si un elemento existe en un array o no (incompleto)
    inArray(array) {
        let compared = [];
        for (let i = 0; i < array.length; i++) {
            compared[i] = array[i];
        }
        return true;
    }
    //quita los elementos de un array unidimensional
    removeDuplicates(array) {
        var list = [];
        for (let e = 0; e < array.length; e++) {
            for (let i = 0; i < list.length; i++) {
                if (array[e] == list[i]) {
                    array.splice(e, 1);
                }
            }
            list.push(array[e]);
        }
        return array;
    }
}
exports.default = Utilities;
