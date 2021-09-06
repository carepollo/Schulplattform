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
    static getPerformance(grade) {
        // Método para tener el adjetivo según la nota
        if (grade > 4.5) {
            return "Superior";
        }
        else if (grade >= 4.0) {
            return "Alto";
        }
        else if (grade >= 3.0) {
            return "Básico";
        }
        else {
            return "Bajo";
        }
    }
}
exports.default = Utilities;
