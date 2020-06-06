export interface Config {
    version: number;
    title?: string;
    panels: ConfigPanel[];
}

export interface ConfigPanel {
    title: string;
    entries: ConfigEntry[];
}
export type ConfigEntryType = string | number | boolean;

export interface ConfigEntry {
    label: string;
    type: InputType;
    value: ConfigEntryType;
    help?: string;
}

export const str2InputType = (s: string): InputType => {
    return s as InputType;
};

export enum InputType {
    INTEGER = "I",
    STRING = "S",
    CHECKBOX = "C",
    HUE = "H",
    FLOAT = "F",
    APIBUTTON = "A",
    PASSWORD = "P"
}

export const toCppType = (t: InputType) => {
    switch (t) {
        case InputType.INTEGER:
            return "uint32_t";
        case InputType.STRING:
        case InputType.PASSWORD:
            return "const char*";
        case InputType.CHECKBOX:
            return "bool";
        case InputType.HUE:
        case InputType.FLOAT:
            return "float";
    }
};

export interface ConfigDataEntry {
    [index: string]: ConfigEntryType;
}
export interface ConfigData {
    [index: string]: ConfigDataEntry;
}

/**
 * Extracts the data from the config.
 *
 * @param config the config
 */
export const getDataFromConfig = (config: Config): ConfigData => {
    const data: ConfigData = {};

    config.panels.forEach((panel: ConfigPanel) => {
        data[panel.title] = {} as ConfigDataEntry;
        panel.entries.forEach((entry: ConfigEntry) => {
            data[panel.title][entry.label] = entry.value;
        });
    });

    return data;
};

/**
 * Applies the data to the given config object.
 *
 * @param config the config
 * @param data the data
 */
export const applyDataToConfig = (config: Config, data: ConfigData) => {
    Object.keys(data).forEach(panelTitle => {
        const panel = config.panels.find(panel => panel.title === panelTitle);
        if (panel) {
            Object.keys(data[panelTitle]).forEach(entryLabel => {
                const entry = panel.entries.find(entry => entry.label === entryLabel);
                if (entry) {
                    entry.value = data[panelTitle][entryLabel];
                }
            });
        }
    });
};
