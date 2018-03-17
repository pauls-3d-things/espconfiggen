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
    const char *schedulingStartTime = cfg.getSchedulingStartTime(root);
    Serial.println(schedulingStartTime);
    const char *schedulingEndTime = cfg.getSchedulingEndTime(root);
    Serial.println(schedulingEndTime);
    float colorsStartColor = cfg.getColorsStartColor(root);
    Serial.println(colorsStartColor);
    float colorsEndColor = cfg.getColorsEndColor(root);
    Serial.println(colorsEndColor);

  } else if (cfg.getConfigVersion(EEPROM) != cfg.getId()) {
    Serial.println("NO CONFIG");
  }
  delay(50);
  c++;
}