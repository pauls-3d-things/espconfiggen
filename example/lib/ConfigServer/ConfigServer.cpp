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

void setupConfigServer(ESP8266WebServer &server, ConfigServerConfig &cfg) {
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

    EEPROM.begin(MAX_CONFIG_SIZE);

    /*
     *  Write Header
     */
    cfg.setConfigVersion(EEPROM, cfg.getId());
    cfg.setConfigLength(EEPROM, len);

    /*
     * Write Data
     */
    for (int n = 0; n < len; n++) {
      EEPROM.write(n + HEADER_SIZE, data[n]);
    }

    EEPROM.commit();
    EEPROM.end();

    server.send(200, "application/json", "{\"success\": \"CFG_SAVED\"}");
  });

  server.on("/data.json", HTTP_GET, [&]() {
    EEPROM.begin(MAX_CONFIG_SIZE);

    /*
     *  Read Header
     */
    // get version of stored config version
    uint8_t version = cfg.getConfigVersion(EEPROM);
#ifdef DEBUG
    Serial.println(version);
#endif
    // check if generated config is present, otherwise allow migration of config
    // (via json)
    if (version == 0) {
      server.send(500, "application/json", "{\"error\": \"CFG_VERSION\"}");
    }
    // get length of config
    uint32_t len = cfg.getConfigLength(EEPROM);
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
    cfg.getConfigString(EEPROM, json, len);

#ifdef DEBUG
    Serial.println(json);
#endif

    EEPROM.end();
    server.send(200, "application/json", json);
  });
}

void ConfigServer::beginOnReset(char *wifi_ssid, char *wifi_pass, boolean ap,
                                ConfigServerConfig &cfg) {
  uint8_t tries = 0;

  rst_info *rinfo;
  Serial.begin(9600);
  Serial.println();
  rinfo = ESP.getResetInfoPtr();

#ifdef DEBUG
  Serial.println(rinfo->reason);
#endif

  switch (rinfo->reason) {
  case REASON_EXT_SYS_RST:
    // external reset button -> go into wifi mode
#ifdef DEBUG
    Serial.println("Caught RESET signal, starting ConfigServer");
#endif

    WiFi.mode(WIFI_STA);
    while (WiFi.status() != WL_CONNECTED) {
#ifdef DEBUG
      Serial.println("Connecting to WIFI");
#endif
      if (tries % 10 == 0) {
        WiFi.begin(wifi_ssid, wifi_pass);
      }

      delay(500);
      tries++;
    }

#ifdef DEBUG
    Serial.println("Connected to WIFI");
    Serial.println(WiFi.localIP());
#endif

    ESP8266WebServer server(80);
    SPIFFS.begin();
    setupConfigServer(server, cfg);
    server.begin();

    while (true) {
      server.handleClient();
    }
    break;
  }
}