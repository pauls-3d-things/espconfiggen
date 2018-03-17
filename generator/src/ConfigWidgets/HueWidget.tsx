import * as React from "react";
import { Label } from "bloomer/lib/elements/Form/Label";
import { Control } from "bloomer/lib/elements/Form/Control";
import { Help } from "bloomer/lib/elements/Form/Help";
import { Field } from "bloomer/lib/elements/Form/Field/Field";
import { ConfigEntryWidget, ConfigEntryWidgetProps } from "./ConfigEntryWidget";
import { HuePicker, ColorChangeHandler, ColorResult } from "react-color";
const hslToHex = require("hsl-to-hex");

interface HueWidgetState {
    color: string;
    hue: number;
}

export class HueWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, HueWidgetState> {

    constructor(props: ConfigEntryWidgetProps) {
        super(props);

        let h: number;
        if (typeof (props.entry.value) === "number") {
            h = props.entry.value;
        } else if (typeof (props.entry.value) === "string") {
            h = Number.parseFloat(props.entry.value) || 0;
        } else {
            h = 0;
        }
        this.state = { color: hslToHex(h, 100, 50), hue: h };
    }

    onEntryChangeComplete: ColorChangeHandler = (color: ColorResult) => {
        this.props.entry.value = color.hsl.h;
        this.props.onEntryChanged();
        this.setState({ color: color.hex, hue: color.hsl.h });
    }

    render() {
        const entry = this.props.entry;
        return (
            <Field key={entry.label + "field"}>
                <Label key={entry.label + "key"}> {entry.label} </Label>
                <Control key={entry.label + "ctrl"} >
                    <HuePicker color={this.state.color} onChangeComplete={this.onEntryChangeComplete} />
                    <Help>Value: {this.state.hue}</Help>
                    {entry.help && <Help>{entry.help} </Help>}
                </Control>
            </Field>
        );
    }
}
