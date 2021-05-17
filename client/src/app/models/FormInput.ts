export interface FormInput {
    type: string;
    label: string;
    placeholder?: string;
    icon?: string;
    value?: string | number | Array<string>;
    dependent?: boolean;
}
