import { Person } from "./Person";

export interface User {
    id?: number;
    username?: string;
    password?: string;
    type?: string;
    picture?: string;
    person?: Person | any;
}