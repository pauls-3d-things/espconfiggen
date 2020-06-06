#include "ConfigServer.h"
#include "ConfigServerConfig.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include <EEPROM.h>
#include <ESP8266WebServer.h>
#include <FS.h>
#include <user_interface.h>

#define serve(server, uri, filePath, contentType)                              \
  {                                                                            \
    server.on(uri, [&]() {                                                     \
      File file = SPIFFS.open(filePath, "r");                                  \
      size_t sent = server.streamFile(file, contentType);                      \
      file.close();                                                            \
    });                                                                        \
  }

void setupConfigServer(ESP8266WebServer &server, ConfigServerConfig &cfg, EEPROMClass &eeprom) {
  /*
   * Static Files from SPIFFS
   */
  serve(server, "/", "/index.html.gz", "text/html");
  serve(server, "/index.html", "/index.html.gz", "text/html");
  serve(server, "/bundle.min.js", "/bundle.min.js.gz",
        "application/javascript");
  serve(server, "/bundle.min.css", "/bundle.min.css.gz", "test/css");
  serve(server, "/config.json", "/config.json", "test/css");

  /*
   * Config Data
   */
  server.on("/data.json", HTTP_POST, [&]() {
    if (server.hasArg("plain") == false) {
      server.send(422, "application/json", "{\"error\": \"CFG_MISSING\"}");
      return;
    }

    // WARNING: there is no validation here! neither if it matches the config
    // structure or is meaningful content.
    String data = server.arg("plain").c_str();
    uint32_t len = data.length();

#ifdef DEBUG
    Serial.println(len);
    Serial.println(data);
#endif
    if (len > MAX_CONFIG_SIZE - 5) {
      server.send(500, "application/json", "{\"error\", \"CFG_TOO_LARGE\"}");
      return;
    }

    /*
     *  Write Header
     */
    cfg.setConfigVersion(eeprom, cfg.getId());
    cfg.setConfigLength(eeprom, len);

    /*
     * Write Data
     */
    for (int n = 0; n < len; n++) {
      eeprom.write(n + HEADER_SIZE, data[n]);
    }

    eeprom.commit();

    server.send(200, "application/json", "{\"success\": \"CFG_SAVED\"}");
  });

  server.on("/data.json", HTTP_GET, [&]() {
    /*
     *  Read Header
     */
    // get version of stored config version
    uint8_t version = cfg.getConfigVersion(eeprom);
#ifdef DEBUG
    Serial.println(version);
#endif
    // check if generated config is present, otherwise allow migration of config
    // (via json)
    if (version == 0) {
      server.send(500, "application/json", "{\"error\": \"CFG_VERSION\"}");
    }
    // get length of config
    uint32_t len = cfg.getConfigLength(eeprom);
#ifdef DEBUG
    Serial.println(len);
#endif
    // validate length of config
    if (len == 0 || len > MAX_CONFIG_SIZE - HEADER_SIZE) {
      server.send(500, "application/json", "{\"error\": \"CFG_SIZE\"}");
      return;
    }

    /*
     * Read Data
     */
    char json[len + 1];
    cfg.getConfigString(eeprom, json, len);

#ifdef DEBUG
    Serial.println(json);
#endif

    server.send(200, "application/json", json);
  });
}

void ConfigServer::joinWifi(const char *wifi_ssid, const char *wifi_pass,
                         ConfigServerConfig &cfg, ESP8266WebServer &server, EEPROMClass &eeprom) {
  uint8_t tries = 0;

  WiFi.mode(WIFI_STA);
  while (WiFi.status() != WL_CONNECTED) {
#ifdef DEBUG
    Serial.println("Connecting to WIFI:");
    Serial.println(wifi_ssid);
#endif
    if (tries % 10 == 0) {
      WiFi.begin(wifi_ssid, wifi_pass);
    }

    delay(1000);
    tries++;
  }

#ifdef DEBUG
  Serial.println("Connected to WIFI");
  Serial.println(WiFi.localIP());
#endif

  setupConfigServer(server, cfg, eeprom);
  server.begin();
}
