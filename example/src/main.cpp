#include "Config.h"
#include "defines.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include <BuildInfo.h>
#include <ConfigServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <Esp.h>
#include <FS.h>
#include <WiFiClient.h>

Config cfg;
DynamicJsonBuffer jsonBuffer(MAX_CONFIG_SIZE);

void setup() {
  ConfigServer cfgServer;
  cfgServer.beginOnReset(WIFI_SSID, WIFI_PASS, false, cfg);
}

void loop(void) {
  // Assume we have a setup, then
  EEPROM.begin(MAX_CONFIG_SIZE);
  uint32_t len = cfg.getConfigLength(EEPROM);
  char json[len + 1];
  cfg.getConfigString(EEPROM, json, len);
  JsonObject &root = jsonBuffer.parseObject(json);

  uint32_t hueStart = cfg.getColorsStartColor(root);
  uint32_t hueStop = cfg.getColorsEndColor(root);
  const char* timeStart = cfg.getSchedulingStartTime(root);
  const char* timeEnd = cfg.getSchedulingEndTime(root);

  EEPROM.end();
  delay(2000);
}