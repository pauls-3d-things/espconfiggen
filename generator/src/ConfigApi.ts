export interface Config {
    version: number;
    title?: string;
    panels: ConfigPanel[];
}

export interface ConfigPanel {
    title: string;
    entries: ConfigEntry[];
}

export interface ConfigEntry {
    label: string;
    type: InputType;
    value: string | number | boolean;
    help?: string;
}

export const str2InputType = (s: string): InputType => {
    return s as InputType;
};

export enum InputType {
    NUMBER = "N", STRING = "S", CHECKBOX = "C"
}
