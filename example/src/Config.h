#ifndef AvailableTypes_H
#define AvailableTypes_H
#include <Arduino.h>
#include <ArduinoJson.h>
#include <ConfigServerConfig.h>
class Config : public ConfigServerConfig {
    public:
      uint8_t getId();
      uint32_t getBasicTypesInteger(JsonObject& root);
      float getBasicTypesFloat(JsonObject& root);
      const char* getBasicTypesString(JsonObject& root);
      bool getBasicTypesCheckbox(JsonObject& root);
      float getExtendedTypesHue(JsonObject& root);
    };
#endif