"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utilities {
    constructor() { }
    //quita los elementos de un array unidimensional
    static removeDuplicates(array) {
        var list = [];
        for (let e = 0; e < array.length; e++) {
            if (list.includes(array[e])) {
                continue;
            }
            else {
                list.push(array[e]);
            }
        }
        return list;
    }
}
exports.default = Utilities;
