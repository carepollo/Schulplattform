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
    id?:number;
    name: string;
    selected?: boolean;
    count?: number;
}
