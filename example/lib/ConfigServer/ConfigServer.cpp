#include <Arduino.h>
#include <ESP8266WebServer.h>
#include <FS.h>

void serve(ESP8266WebServer &server, const String &uri, const String &filePath,
           const String &contentType) {
  server.on(uri, [&]() {
    Serial.println("serving" + uri + " -> " + filePath);
    File file = SPIFFS.open(filePath, "r");
    size_t sent = server.streamFile(file, contentType);
    file.close();

  });
}

void setupConfigServer(ESP8266WebServer &server) {
  server.on("/index.html", [&]() {
    File file = SPIFFS.open("/index.html.gz", "r");
    size_t sent = server.streamFile(file, "text/html");
    file.close();
  });
  server.on("/bundle.min.js", [&]() {
    File file = SPIFFS.open("/bundle.min.js.gz", "r");
    size_t sent = server.streamFile(file, "application/javascript");
    file.close();
  });
  server.on("/bulma.min.css", [&]() {
    File file = SPIFFS.open("/bulma.min.css.gz", "r");
    size_t sent = server.streamFile(file, "text/css");
    file.close();
  });
  server.on("/config.json", [&]() {
    File file = SPIFFS.open("/config.json", "r");
    size_t sent = server.streamFile(file, "application/json");
    file.close();
  });
}