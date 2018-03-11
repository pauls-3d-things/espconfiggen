#ifndef CONFIG_SERVER_CONFIG_H
#define CONFIG_SERVER_CONFIG_H
#include <Arduino.h>
#include <EEPROM.h>

#ifndef MAX_CONFIG_SIZE
#define MAX_CONFIG_SIZE 1024
#endif

#define HEADER_SIZE 4 + 1

class ConfigServerConfig {
public:
  virtual uint8_t getId();

  uint8_t getConfigVersion(EEPROMClass &eeprom);
  void setConfigVersion(EEPROMClass &eeprom, uint8_t version);

  uint32_t getConfigLength(EEPROMClass &eeprom);
  void setConfigLength(EEPROMClass &eeprom, uint32_t length);

  void getConfigString(EEPROMClass &eeprom, char *json, uint32_t length);
};

#endif
