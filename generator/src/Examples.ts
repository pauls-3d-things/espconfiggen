
export const exampleNew = {
    "version": 0,
    "title": "",
    "panels": []
};

export const exampleTypes = {
    "version": 0,
    "title": "Available Types",
    "panels": [
        {
            "title": "Basic Types",
            "entries": [
                {
                    "label": "Integer",
                    "help": "This is a number type. (uint32_t)",
                    "type": "I",
                    "value": 1337
                },
                {
                    "label": "Float",
                    "help": "This is a number type. (float)",
                    "type": "F",
                    "value": 123.45678
                },
                {
                    "label": "String",
                    "help": "This is a string type. (char*)",
                    "type": "S",
                    "value": "asdfjklö"
                },
                {
                    "label": "Checkbox",
                    "help": "This is a checkbox type. (bool)",
                    "type": "C",
                    "value": true
                }
            ]
        },
        {
            "title": "Extended Types",
            "entries": [
                {
                    "label": "Hue",
                    "help": "This is a Hue type.",
                    "type": "H",
                    "value": 42
                },
                {
                    "label": "Toggle LED",
                    "help": "This is an ApiButton type, it will HTTP GET the configured URL",
                    "type": "A",
                    "value": "/api/led/1/toggle"
                }
            ]
        }
    ]
};

export const exampleHue = {
    "version": 0,
    "title": "Hue Example",
    "panels": [
        {
            "title": "Scheduling",
            "entries": [
                {
                    "label": "Start Time",
                    "help": "hh:mm",
                    "type": "S",
                    "value": "08:00"
                },
                {
                    "label": "End Time",
                    "help": "hh:mm",
                    "type": "S",
                    "value": "20:00"
                }
            ]
        },
        {
            "title": "Colors",
            "entries": [
                {
                    "label": "Start Color",
                    "type": "H",
                    "value": 132
                },
                {
                    "label": "End Color",
                    "type": "H",
                    "value": 42
                }
            ]
        }
    ]
};
