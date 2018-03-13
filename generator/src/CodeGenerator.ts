import { Config, ConfigPanel, ConfigEntry, toCppType } from "./ConfigApi";

const toCamelCase = (label: string) => {
    return label.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return match.toUpperCase();
    });
};

type ConfigCodeGenerator = (code: string[], panel: ConfigPanel, entry: ConfigEntry) => void;

const hppGenerator = (code: string[], panel: ConfigPanel, entry: ConfigEntry) => {
    code.push(`      ${toCppType(entry.type)} get${toCamelCase(panel.title)}${toCamelCase(entry.label)}(JsonObject& root);`);
};

const cppGenerator = (code: string[], panel: ConfigPanel, entry: ConfigEntry) => {
    code.push("");
    code.push(`${toCppType(entry.type)} Config::get${toCamelCase(panel.title)}${toCamelCase(entry.label)}(JsonObject& root) {`);
    code.push(`  return root["${panel.title}"]["${entry.label}"];`);
    code.push("}");
};

const appendPanel = (code: string[], panel: ConfigPanel, generator: ConfigCodeGenerator) => {
    panel.entries.forEach((entry: ConfigEntry) => generator(code, panel, entry));
};

export const generateConfigH = (config: Config): string => {
    let code: string[] = [];
    code.push("#ifndef " + toCamelCase(config.title || "Config") + "_H");
    code.push("#define " + toCamelCase(config.title || "Config") + "_H");
    code.push("#include <Arduino.h>");
    code.push("#include <ArduinoJson.h>");
    code.push("#include <ConfigServerConfig.h>");

    code.push("class Config : public ConfigServerConfig {");
    code.push("    public:");
    code.push("      uint8_t getId();");
    config.panels.forEach((panel: ConfigPanel) => appendPanel(code, panel, hppGenerator));
    code.push("    };");

    code.push("#endif");
    return code.join("\n");
};

export const generateConfigCpp = (config: Config): string => {
    let code: string[] = [];

    code.push("#include \"Config.h\"");
    code.push("#include <Arduino.h>");
    code.push("");
    code.push(`uint8_t Config::getId() { return ${config.version}; };`);

    config.panels.forEach((panel: ConfigPanel) => appendPanel(code, panel, cppGenerator));

    return code.join("\n");
};
