import * as React from "react";
import { ConfigEntry, InputType } from "../ConfigApi";
import { CheckboxWidget } from "./CheckboxWidget";
import { InputWidget } from "./InputWidget";
import { ConfigEntryWidget } from "./ConfigEntryWidget";
import { RGBWidget } from "./HueWidget";
import { NumberWidget } from "./NumberWidget";
import { ApiButtonWidget } from "./ApiButtonWidget";
import { PasswordWidget } from "./PasswordWidget";

export const renderEntry = (entry: ConfigEntry, onEntryChanged: () => void, isInGeneratorApp: boolean) => {
    let configEntryWidget;

    switch (entry.type) {
        case InputType.STRING:
            configEntryWidget = InputWidget;
            break;
        case InputType.LONG:
        case InputType.INTEGER:
        case InputType.SHORT:
        case InputType.DOUBLE:
        case InputType.FLOAT:
            configEntryWidget = NumberWidget;
            break;
        case InputType.CHECKBOX:
            configEntryWidget = CheckboxWidget;
            break;
        case InputType.RGB:
            configEntryWidget = RGBWidget;
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
