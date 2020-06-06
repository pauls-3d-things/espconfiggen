#include "Config.h"
#include <Arduino.h>

uint8_t Config::getId() { return 0; };

uint32_t Config::getBasicTypesInteger(JsonObject& root) {
  return root["Basic Types"]["Integer"];
}

float Config::getBasicTypesFloat(JsonObject& root) {
  return root["Basic Types"]["Float"];
}

const char* Config::getBasicTypesString(JsonObject& root) {
  return root["Basic Types"]["String"];
}

bool Config::getBasicTypesCheckbox(JsonObject& root) {
  return root["Basic Types"]["Checkbox"];
}

float Config::getExtendedTypesHue(JsonObject& root) {
  return root["Extended Types"]["Hue"];
}