import * as React from "react";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { ConfigEntry } from "../ConfigApi";
const hslToHex = require("hsl-to-hex");
import { Label } from "trunx/component/Label"
import { Field } from "trunx/component/Field";
import { Control } from "trunx/component/Control";
import { Help } from "trunx/component/Help";
import { Input } from "trunx/component/Input";

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

    onEntryChange = (entry: any, event: React.FormEvent<HTMLInputElement>) => {
        entry.value = event.currentTarget.value;
        this.props.onEntryChanged();
    }
    render() {
        const entry = this.props.entry;
        return (
            <Field key={entry.label + "field"}>
                <Label key={entry.label + "key"}> {entry.label} </Label>
                <Control key={entry.label + "ctrl"} >
                    <Input
                        type="number"
                        min="0"
                        max="360"
                        value={"" + entry.value}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => this.onEntryChange(entry, event)}
                    />                    {entry.help && <Help>{entry.help} </Help>}
                </Control>
            </Field>
        );
    }
}
