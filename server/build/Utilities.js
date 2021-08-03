"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utilities {
    constructor() { }
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
