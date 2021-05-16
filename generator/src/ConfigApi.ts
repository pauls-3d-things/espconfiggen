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
    return InputType[s as keyof typeof InputType];
};

var lookupTable: any;
export const value2InputType = (v: string): InputType => {
    // https://www.typescriptlang.org/docs/handbook/enums.html
    if (!lookupTable) {
        lookupTable = {};
        Object.keys(InputType).forEach(e => {
            lookupTable[InputType[e as keyof typeof InputType]] = e;
        })
    }
    return lookupTable[v];
}

export enum InputType {
    LONG = "L",
    INTEGER = "I",
    SHORT = "i",
    STRING = "S",
    CHECKBOX = "C",
    RGB = "R",
    DOUBLE = "D",
    FLOAT = "F",
    APIBUTTON = "A",
    PASSWORD = "P"
}

export const toCppType = (t: InputType) => {
    switch (t) {
        case InputType.RGB:
        case InputType.LONG:
            return "uint32_t";
        case InputType.INTEGER:
            return "int32_t";
        case InputType.SHORT:
            return "int16_t";
        case InputType.STRING:
        case InputType.PASSWORD:
            return "const char*";
        case InputType.CHECKBOX:
            return "bool";
        case InputType.FLOAT:
            return "float";
        case InputType.DOUBLE:
            return "double";
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
        const panel = config.panels.find(p => p.title === panelTitle);
        if (panel) {
            Object.keys(data[panelTitle]).forEach(entryLabel => {
                const entry = panel.entries.find(e => e.label === entryLabel);
                if (entry) {
                    entry.value = data[panelTitle][entryLabel];
                }
            });
        }
    });
};

export interface OswData {
    entries: OswDataEntry[];
}

export interface OswDataEntry {
    id: string;
    value: string;
}


export interface OswConfig {
    entries: OswConfigEntry[];
}
export interface OswConfigEntry {
    id: string;
    section: string;
    label: string;
    help: string;
    type: string;
    default: string;
    value: string
}

export const oswConfigToConfig = (oswConfig: OswConfig): Config => {
    var result: Config = { panels: [], version: 0, title: "Configuration" };
    oswConfig.entries.forEach(e => {
        var panel = result.panels.find(p => p.title == e.section);
        if (!panel) {
            panel = { entries: [], title: e.section };
            result.panels.push(panel);
        }
        panel.entries.push({
            label: e.label,
            type: e.type as InputType,
            value: e.value,
            help: e.help
        })
    })

    return result;
}

export const configDataToOswData = (configData: ConfigData, oswConfig: OswConfig) => {
    var result: OswData = { entries: [] };


    oswConfig.entries.forEach(oswEntry => {
        var data: OswDataEntry = {
            id: oswEntry.id,
            value: "" + configData[oswEntry.section][oswEntry.label]
        };
        result.entries.push(data);
    })


    return result;
}
