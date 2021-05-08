import * as React from "react";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { InputType, ConfigEntry } from "../ConfigApi";
import { Input } from "trunx/component/Input"
import { Label } from "trunx/component/Label"
import { Field } from "trunx/component/Field";
import { Control } from "trunx/component/Control";
import { Help } from "trunx/component/Help";
export class NumberWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, ConfigEntryWidgetState> {

    constructor(props: ConfigEntryWidgetProps) {
        super(props);
    }

    onEntryChange = (entry: ConfigEntry, event: React.FormEvent<HTMLInputElement>) => {
        switch (entry.type) {
            case InputType.LONG:
            case InputType.INTEGER:
            case InputType.SHORT:
                entry.value = Number.parseInt(event.currentTarget.value, 10);
                break;
            case InputType.DOUBLE:
            case InputType.FLOAT:
                entry.value = Number.parseFloat(event.currentTarget.value);
                break;
        }
        this.props.onEntryChanged();
    }

    render() {
        const entry = this.props.entry;
        return (
            <Field key={entry.label + "field"}>
                <Label>{entry.label} </Label>
                <Control key={entry.label + "ctrl"} >
                    <Input
                        type="number"
                        // TODO: MIN MAX VALUES
                        step={entry.type === InputType.INTEGER ? "1" : "any"}
                        value={typeof (entry.value) === "number" ? "" + entry.value : "" + Number.parseInt("" + entry.value, 10)
                        }
                        onChange={(event: React.FormEvent<HTMLInputElement>) => this.onEntryChange(entry, event)}
                    />
                    {
                        entry.help && <Help>{entry.help} </Help>}
                </Control>
            </Field>
        );
    }
}
