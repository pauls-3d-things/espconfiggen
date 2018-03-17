import * as React from "react";
import { Label } from "bloomer/lib/elements/Form/Label";
import { Control } from "bloomer/lib/elements/Form/Control";
import { Help } from "bloomer/lib/elements/Form/Help";
import { Field } from "bloomer/lib/elements/Form/Field/Field";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { HuePicker, ColorChangeHandler, ColorResult } from "react-color";
import { ConfigEntry } from "../ConfigApi";
const hslToHex = require("hsl-to-hex");

export class HueWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, ConfigEntryWidgetState> {

    constructor(props: ConfigEntryWidgetProps) {
        super(props);
    }

    hueToHex = (entry: ConfigEntry) => {
        let h: number;
        if (typeof (entry.value) === "number") {
            h = entry.value;
        } else if (typeof (entry.value) === "string") {
            h = Number.parseFloat(entry.value) || 0;
        } else {
            h = 0;
        }
        return hslToHex(h, 100, 50);
    }

    onEntryChangeComplete: ColorChangeHandler = (color: ColorResult) => {
        this.props.entry.value = color.hsl.h;
        this.props.onEntryChanged();
    }

    render() {
        const entry = this.props.entry;
        return (
            <Field key={entry.label + "field"}>
                <Label key={entry.label + "key"}> {entry.label} </Label>
                <Control key={entry.label + "ctrl"} >
                    <HuePicker color={this.hueToHex(this.props.entry)} onChangeComplete={this.onEntryChangeComplete} />
                    {entry.help && <Help>{entry.help} </Help>}
                </Control>
            </Field>
        );
    }
}
