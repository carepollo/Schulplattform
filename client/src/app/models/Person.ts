import { SelectOption } from "./SelectOption";

export interface Person {
    id_person?: number;
    id_type?: string;
    names?: string;
    lastnames?: string;
    zone_expedition?: SelectOption | any;
    city_expedition?: SelectOption | any;
    rh?: string;
    health?: string;
    level?: string;
    study?: string;
    zone_lives?: SelectOption | any;
    city_lives?: SelectOption | any;
    address?: string;
    phone?: string;
    email?: string;
    site?: string;
    scheme?: string;
    assigned_user?: number;
    assigned_group?: number;
}
