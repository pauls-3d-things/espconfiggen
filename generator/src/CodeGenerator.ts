import { Config, ConfigPanel, ConfigEntry, toCppType } from "./ConfigApi";

const toCamelCase = (label: string) => {
    // paul: this is a paste&mod from StackOverflow
    return label.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return match.toUpperCase();
    });
};

type ConfigCodeGenerator = (code: string[], panel: ConfigPanel, entry: ConfigEntry) => void;

const toVar = (panel: ConfigPanel, entry: ConfigEntry) => {
    const s = `${toCamelCase(panel.title)}${toCamelCase(entry.label)}`;
    return s.charAt(0).toLowerCase() + s.slice(1);
};

const mainGenerator = (code: string[], panel: ConfigPanel, entry: ConfigEntry) => {
    code.push(`  ${toCppType(entry.type)} ${toVar(panel, entry)} = cfg.get${toCamelCase(panel.title)}${toCamelCase(entry.label)}(root);`);
    code.push(`  Serial.println(${toVar(panel, entry)});`);
};
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

export const generateMainpp = (config: Config): string => {
    let code: string[] = [];
    code.push("#include \"Config.h\"");
    code.push("#include <Arduino.h>");
    code.push("#include <ArduinoJson.h>");
    code.push("#include <ConfigServer.h>");
    code.push("");
    code.push("Config cfg;");
    code.push("DynamicJsonBuffer jsonBuffer(MAX_CONFIG_SIZE);");
    code.push("");
    code.push("void setup() {");
    code.push("  ConfigServer cfgServer;");
    code.push("  // TODO: configure which network to join here");
    code.push("  cfgServer.beginOnReset(\"asdf\", \"asdf\", false, cfg);");
    code.push("}");
    code.push("");
    code.push("void loop(void) {");
    code.push("  // Get the config object");
    code.push("  EEPROM.begin(MAX_CONFIG_SIZE);");
    code.push("  uint32_t len = cfg.getConfigLength(EEPROM);");
    code.push("  char buf[len + 1];");
    code.push("  cfg.getConfigString(EEPROM, buf, len);");
    code.push("  JsonObject &root = jsonBuffer.parseObject(buf);");
    code.push("  EEPROM.end();");
    code.push("");
    code.push("  // Read values via API");

    config.panels.forEach((panel: ConfigPanel) => appendPanel(code, panel, mainGenerator));

    code.push("");
    code.push("  delay(2000);");
    code.push("}");
    return code.join("\n");
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
