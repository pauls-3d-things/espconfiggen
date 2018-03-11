#ifndef CONFIG_SERVER_H
#define CONFIG_SERVER_H
#include "ConfigServerConfig.h"
#include <ESP8266WebServer.h>

void setupConfigServer(ESP8266WebServer &server, ConfigServerConfig &cfg);

class ConfigServer {
public:
  void beginOnReset(char *wifi_ssid, char *wifi_pass, boolean ap, ConfigServerConfig &cfg);
};

#endif