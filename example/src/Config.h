#ifndef HueExample_H
#define HueExample_H
#include <Arduino.h>
#include <ArduinoJson.h>
#include <ConfigServerConfig.h>
class Config : public ConfigServerConfig {
    public:
      uint8_t getId();
      const char* getSchedulingStartTime(JsonObject& root);
      const char* getSchedulingEndTime(JsonObject& root);
      uint32_t getColorsStartColor(JsonObject& root);
      uint32_t getColorsEndColor(JsonObject& root);
    };
#endif