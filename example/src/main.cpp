#include "config.h"
#include <Arduino.h>
#include <BuildInfo.h>
#include <ConfigServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <Esp.h>
#include <FS.h>
#include <WiFiClient.h>
#include <user_interface.h>

void setup() {
  uint8_t tries = 0;

  rst_info *rinfo;
  Serial.begin(9600);
  Serial.println();
  rinfo = ESP.getResetInfoPtr();

  if (DEBUG) {
    Serial.println(rinfo->reason);
  }

  switch (rinfo->reason) {
  case REASON_EXT_SYS_RST:
    // external reset button -> go into wifi mode
    if (DEBUG) {
      Serial.println("Caught RESET signal, starting ConfigServer");
    }

    WiFi.mode(WIFI_STA);
    while (WiFi.status() != WL_CONNECTED) {
      if (DEBUG) {
        Serial.println("Connecting to WIFI");
      }
      if (tries % 10 == 0) {
        WiFi.begin(WIFI_SSID, WIFI_PASS);
      }

      delay(500);
      tries++;
    }

    if (DEBUG) {
      Serial.println("Connected to WIFI");
      Serial.println(WiFi.localIP());
    }

    ESP8266WebServer server(80);
    SPIFFS.begin();
    setupConfigServer(server);
    server.begin();

    while (true) {
      server.handleClient();
    }
    break;
  }
}

void loop(void) {
  // TODO
}