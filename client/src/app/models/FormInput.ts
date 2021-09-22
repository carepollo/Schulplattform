import { SelectOption } from "./SelectOption";

export interface FormInput {
    type: string;
    label: string;
    placeholder?: string;
    icon?: string;
    options?: Array<SelectOption>;
    dependent?: boolean;
    pointer?: string;
}
