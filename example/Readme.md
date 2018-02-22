# PlatformIO Build Boilerplate

This is my boilerplate for [PlatformIO](http://platformio.org) based projects.
This example uses the target platform *espressif8266*. You can change this in the `platformio.ini` file.

## Usage

You can build via the PlatformIO IDE. In this case the `DEBUG` flag will be set and the following defines are available:

```cpp
#define BUILD_HASH "DEBUG"
#define BUILD_DATE "0000-00-00"
#define BUILD_TIME "00:00:00"
```

If you build via `./build.sh build` or `./build.sh upload`, the script first checks if the git repository is clean, and then generates the build info from the last commit. This will result in the defines being set similar to this example:

```cpp
#define BUILD_DATE "2018-01-28"
#define BUILD_TIME "20:36:40"
#define BUILD_HASH "580c71d"
```