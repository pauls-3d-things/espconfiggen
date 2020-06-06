import * as React from "react";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { HuePicker, ColorChangeHandler, ColorResult } from "react-color";
import { ConfigEntry } from "../ConfigApi";
import { Form } from "react-bulma-components";
const hslToHex = require("hsl-to-hex");

export class HueWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, ConfigEntryWidgetState> {

    constructor(props: ConfigEntryWidgetProps) {
        super(props);
    }

    hueToHex = (entry: ConfigEntry): string => {
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
            <Form.Field key={entry.label + "field"}>
                <Form.Label key={entry.label + "key"}> {entry.label} </Form.Label>
                <Form.Control key={entry.label + "ctrl"} >
                    <HuePicker
                        color={this.hueToHex(this.props.entry)}
                        width="100%"
                        onChangeComplete={this.onEntryChangeComplete} />
                    {entry.help && <Form.Help>{entry.help} </Form.Help>}
                </Form.Control>
            </Form.Field>
        );
    }
}
