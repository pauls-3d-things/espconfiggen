import * as React from "react";
import { ConfigEntry, InputType } from "../ConfigApi";
import { CheckboxWidget } from "./CheckboxWidget";
import { InputWidget } from "./InputWidget";
import { ConfigEntryWidget } from "./ConfigEntryWidget";
import { HueWidget } from "./HueWidget";
import { NumberWidget } from "./NumberWidget";
import { ApiButtonWidget } from "./ApiButtonWidget";
import { PasswordWidget } from "./PasswordWidget";

export const renderEntry = (entry: ConfigEntry, onEntryChanged: () => void, isInGeneratorApp: boolean) => {
    let configEntryWidget;

    switch (entry.type) {
        case InputType.STRING:
            configEntryWidget = InputWidget;
            break;
        case InputType.INTEGER:
        case InputType.FLOAT:
            configEntryWidget = NumberWidget;
            break;
        case InputType.CHECKBOX:
            configEntryWidget = CheckboxWidget;
            break;
        case InputType.HUE:
            configEntryWidget = HueWidget;
            break;
        case InputType.APIBUTTON:
            configEntryWidget = ApiButtonWidget;
            break;
        case InputType.PASSWORD:
            configEntryWidget = PasswordWidget;
            break;
        default:
            configEntryWidget = ConfigEntryWidget;
    }

    return React.createElement(configEntryWidget, { entry, onEntryChanged, isInGeneratorApp });
};
