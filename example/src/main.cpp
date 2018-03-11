#include "GenConfig.h"
#include "config.h"
#include <Arduino.h>
#include <BuildInfo.h>
#include <ConfigServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <Esp.h>
#include <FS.h>
#include <WiFiClient.h>

void setup() {
  GenConfig cfg;
  ConfigServer cfgServer;
  cfgServer.beginOnReset(WIFI_SSID, WIFI_PASS, false, cfg);
}

void loop(void) {
  // TODO
}