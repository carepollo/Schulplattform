export interface Survey {
    id?:number;
    title:string;
    dateStart:any;
    dateEnd?:any;
    description?:string;
    options: SurveyOption[];
    state?: boolean;
}

export interface SurveyOption {
    name: string;
    selected?: boolean;
    count?: number;
}
