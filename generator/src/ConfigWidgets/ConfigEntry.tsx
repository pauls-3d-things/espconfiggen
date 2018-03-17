import * as React from "react";
import { ConfigEntry, InputType } from "../ConfigApi";
import { CheckboxWidget } from "./CheckboxWidget";
import { IntegerWidget } from "./IntegerWidget";
import { InputWidget } from "./InputWidget";
import { ConfigEntryWidget } from "./ConfigEntryWidget";
import { HueWidget } from "./HueWidget";

export const renderEntry = (entry: ConfigEntry, onEntryChanged: () => void) => {
    let configEntryWidget;

    switch (entry.type) {
        case InputType.STRING:
            configEntryWidget = InputWidget;
            break;
        case InputType.INTEGER:
            configEntryWidget = IntegerWidget;
            break;
        case InputType.CHECKBOX:
            configEntryWidget = CheckboxWidget;
            break;
        case InputType.HUE:
            configEntryWidget = HueWidget;
            break;
        default:
            configEntryWidget = ConfigEntryWidget;
    }

    return React.createElement(configEntryWidget, { entry, onEntryChanged });
};
