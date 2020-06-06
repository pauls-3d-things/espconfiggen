#ifndef CONFIG_SERVER_H
#define CONFIG_SERVER_H
#include "ConfigServerConfig.h"
#include <ESP8266WebServer.h>

void setupConfigServer(ESP8266WebServer &server, ConfigServerConfig &cfg);

class ConfigServer {
public:
  void joinWifi(const char *wifi_ssid,const char *wifi_pass, ConfigServerConfig &cfg,
             ESP8266WebServer &server, EEPROMClass &eeprom);
};

#endif