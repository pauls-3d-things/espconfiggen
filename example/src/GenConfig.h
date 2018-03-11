#ifndef GEN_CONFIG_H
#define GEN_CONFIG_H

#include <ConfigServerConfig.h>

class GenConfig : public ConfigServerConfig {
public:
  uint8_t getId();
};

#endif