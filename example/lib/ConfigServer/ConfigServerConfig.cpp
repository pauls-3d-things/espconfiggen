#include "ConfigServerConfig.h"

uint8_t ConfigServerConfig::getId() { return 0; }

uint8_t ConfigServerConfig::getConfigVersion(EEPROMClass &eeprom) {
  return EEPROM.read(0);
}

void ConfigServerConfig::setConfigVersion(EEPROMClass &eeprom,
                                          uint8_t version) {
  eeprom.write(0, version);
}

uint32_t ConfigServerConfig::getConfigLength(EEPROMClass &eeprom) {
  uint32_t len = (uint32_t)               //
                 (eeprom.read(4) << 24)   //
                 | (eeprom.read(3) << 16) //
                 | (eeprom.read(2) << 8)  //
                 | eeprom.read(1);
  return len;
}

void ConfigServerConfig::setConfigLength(EEPROMClass &eeprom, uint32_t length) {
  eeprom.write(1, (byte)length);
  eeprom.write(2, (byte)length >> 8);
  eeprom.write(3, (byte)length >> 16);
  eeprom.write(4, (byte)length >> 24);
}

void ConfigServerConfig::getConfigString(EEPROMClass &eeprom, char *json,
                                         uint32_t length) {
  for (int n = 0; n < length; n++) {
    json[n] = eeprom.read(n + HEADER_SIZE);
  }
  json[length] = 0; // terminate string
}