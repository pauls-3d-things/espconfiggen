#include "Config.h"
#include <Arduino.h>

uint8_t Config::getId() { return 0; };

const char* Config::getSchedulingStartTime(JsonObject& root) {
  return root["Scheduling"]["Start Time"];
}

const char* Config::getSchedulingEndTime(JsonObject& root) {
  return root["Scheduling"]["End Time"];
}

uint32_t Config::getColorsStartColor(JsonObject& root) {
  return root["Colors"]["Start Color"];
}

uint32_t Config::getColorsEndColor(JsonObject& root) {
  return root["Colors"]["End Color"];
}