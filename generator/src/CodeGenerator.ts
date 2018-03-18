import { Config, ConfigPanel, ConfigEntry, toCppType, InputType } from "./ConfigApi";

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

const mainApiGenerator = (code: string[], panel: ConfigPanel, entry: ConfigEntry) => {
    code.push(`  // UI Button: ${entry.label}`);
    if (entry.help) {
        code.push(`  // Help text: ${entry.help}`);
    }
    code.push(`  server.on("${entry.value}", HTTP_GET, [&]() {`);
    code.push(`    server.send(200, "application/json", "{\\"msg\\":\\"OK\\"}");`);
    code.push(`  });`);
};

const mainGenerator = (code: string[], panel: ConfigPanel, entry: ConfigEntry) => {
    code.push(`    ${toCppType(entry.type)} ${toVar(panel, entry)} = cfg.get${toCamelCase(panel.title)}${toCamelCase(entry.label)}(root);`);
    code.push(`    Serial.println(${toVar(panel, entry)});`);
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

const appendPanel = (code: string[], panel: ConfigPanel, generator: ConfigCodeGenerator, filter: (entry: ConfigEntry) => boolean) => {
    panel.entries.filter(filter).forEach((entry: ConfigEntry) => generator(code, panel, entry));
};

export const generateMainCpp = (config: Config): string => {
    let code: string[] = [];
    code.push("#include \"Config.h\"");
    code.push("#include \"defines.h\"");
    code.push("#include <Arduino.h>");
    code.push("#include <ArduinoJson.h>");
    code.push("#include <ConfigServer.h>");
    code.push("#include <ESP8266WebServer.h>");
    code.push("#include <FS.h>");
    code.push("");
    code.push("ESP8266WebServer server(80);");
    code.push("ConfigServer cfgServer;");
    code.push("Config cfg;");
    code.push("");
    code.push("void setup() {");
    code.push("  Serial.begin(9600);");
    code.push("  EEPROM.begin(MAX_CONFIG_SIZE);");
    code.push("  SPIFFS.begin();");

    code.push("");
    code.push("  // implement your api actions here");
    config.panels.forEach((panel: ConfigPanel) => appendPanel(code, panel, mainApiGenerator, e => e.type === InputType.APIBUTTON));

    code.push("");
    code.push("  // define WIFI_SSID,WIFI_PASS in defines.h, then add to .gitignore");
    code.push("  cfgServer.joinWifi(WIFI_SSID, WIFI_PASS, cfg, server, EEPROM);");

    code.push("}");
    code.push("");
    code.push("uint8_t c = 0;");
    code.push("void loop(void) {");
    code.push("  server.handleClient();");
    code.push("");
    code.push("  // Get the config object");
    code.push("  if (c % 10 == 0 && cfg.getConfigVersion(EEPROM) == cfg.getId()) {");
    code.push("    uint32_t len = cfg.getConfigLength(EEPROM);");
    code.push("    char buf[len + 1];");
    code.push("    cfg.getConfigString(EEPROM, buf, len);");
    code.push("    StaticJsonBuffer<MAX_CONFIG_SIZE> jsonBuffer;");
    code.push("    JsonObject &root = jsonBuffer.parseObject(buf);");
    code.push("");
    code.push("    // Read values via API");

    config.panels.forEach((panel: ConfigPanel) => appendPanel(code, panel, mainGenerator, e => e.type !== InputType.APIBUTTON));

    code.push("");
    code.push("  } else if (cfg.getConfigVersion(EEPROM) != cfg.getId()) {");
    code.push("    Serial.println(\"NO CONFIG\");");
    code.push("  }");
    code.push("  delay(50);");
    code.push("  c++;");
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
    config.panels.forEach((panel: ConfigPanel) => appendPanel(code, panel, hppGenerator, e => e.type !== InputType.APIBUTTON));
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

    config.panels.forEach((panel: ConfigPanel) => appendPanel(code, panel, cppGenerator, e => e.type !== InputType.APIBUTTON));

    return code.join("\n");
};
