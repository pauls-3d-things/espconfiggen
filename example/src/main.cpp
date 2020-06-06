#include "Config.h"
#include "defines.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include <ConfigServer.h>
#include <ESP8266WebServer.h>
#include <FS.h>

ESP8266WebServer server(80);
ConfigServer cfgServer;
Config cfg;

void setup() {
  Serial.begin(9600);
  EEPROM.begin(MAX_CONFIG_SIZE);
  SPIFFS.begin();

  // implement your api actions here
  // UI Button: Toggle LED
  // Help text: This is an ApiButton type, it will HTTP GET the configured URL
  server.on("/api/led/1/toggle", HTTP_GET, [&]() {
    server.send(200, "application/json", "{\"msg\":\"OK\"}");
  });

  // define WIFI_SSID,WIFI_PASS in defines.h, then add to .gitignore
  cfgServer.joinWifi(WIFI_SSID, WIFI_PASS, cfg, server, EEPROM);
}

uint8_t c = 0;
void loop(void) {
  server.handleClient();

  // Get the config object
  if (c % 10 == 0 && cfg.getConfigVersion(EEPROM) == cfg.getId()) {
    uint32_t len = cfg.getConfigLength(EEPROM);
    char buf[len + 1];
    cfg.getConfigString(EEPROM, buf, len);
    StaticJsonBuffer<MAX_CONFIG_SIZE> jsonBuffer;
    JsonObject &root = jsonBuffer.parseObject(buf);

    // Read values via API
    uint32_t basicTypesInteger = cfg.getBasicTypesInteger(root);
    Serial.println(basicTypesInteger);
    float basicTypesFloat = cfg.getBasicTypesFloat(root);
    Serial.println(basicTypesFloat);
    const char* basicTypesString = cfg.getBasicTypesString(root);
    Serial.println(basicTypesString);
    bool basicTypesCheckbox = cfg.getBasicTypesCheckbox(root);
    Serial.println(basicTypesCheckbox);
    float extendedTypesHue = cfg.getExtendedTypesHue(root);
    Serial.println(extendedTypesHue);

  } else if (cfg.getConfigVersion(EEPROM) != cfg.getId()) {
    Serial.println("NO CONFIG");
  }
  delay(50);
  c++;
}