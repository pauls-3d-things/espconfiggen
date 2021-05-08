import * as React from "react";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { Label } from "trunx/component/Label"
import { Field } from "trunx/component/Field";
import { Control } from "trunx/component/Control";
import { Help } from "trunx/component/Help";
import { Input } from "trunx/component/Input";

export class RGBWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, ConfigEntryWidgetState> {

    constructor(props: ConfigEntryWidgetProps) {
        super(props);
    }

    hexToInt = (hex: string): number => {
        if (!hex.startsWith("#")) {
            return 0;
        }
        if (hex.length != 7) {
            return 0;
        }
        let s = hex.substring(1).match(/.{1,2}/g)
        if (s) {
            console.log(s);
            let r = s[0].length != 2 ? 0 : parseInt(s[0], 16);
            let g = s[0].length != 2 ? 0 : parseInt(s[1], 16);
            let b = s[0].length != 2 ? 0 : parseInt(s[2], 16);
            console.log(r, g, b);
            return (r << 16) + (g << 8) + b;
        }
        return 0;
    }

    intToHex = (int: number): string => {
        let r = "" + ((int << 8) >>> 24).toString(16);
        let g = "" + ((int << 16) >>> 24).toString(16);
        let b = "" + ((int << 24) >>> 24).toString(16);
        r = r.length < 2 ? "0" + r : r;
        g = g.length < 2 ? "0" + g : g;
        b = b.length < 2 ? "0" + b : b;
        return "#" + r + g + b;
    }

    onEntryChange = (entry: any, event: React.FormEvent<HTMLInputElement>) => {
        entry.value = this.hexToInt(event.currentTarget.value);
        this.props.onEntryChanged();
    }
    render() {
        const entry = this.props.entry;
        let value = 0;
        if(typeof(entry.value) == "number") {
            value = entry.value;
        } else if (typeof(entry.value) == "string") {
            try {
                value = parseInt(entry.value);
            } catch (e) {
                console.log(e);
            }
        }
        return (
            <Field key={entry.label + "field"}>
                <Label key={entry.label + "key"}> {entry.label} </Label>
                <Control key={entry.label + "ctrl"} >
                    <Input
                        type="color"
                        value={"" + this.intToHex(value)}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => this.onEntryChange(entry, event)}
                    />                    {entry.help && <Help>{entry.help} </Help>}
                </Control>
            </Field>
        );
    }
}
