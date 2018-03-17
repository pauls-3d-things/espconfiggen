import * as React from "react";
import { Label } from "bloomer/lib/elements/Form/Label";
import { Input } from "bloomer/lib/elements/Form/Input";
import { Control } from "bloomer/lib/elements/Form/Control";
import { Help } from "bloomer/lib/elements/Form/Help";
import { Field } from "bloomer/lib/elements/Form/Field/Field";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { InputType, ConfigEntry } from "../ConfigApi";

export class NumberWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, ConfigEntryWidgetState> {

    constructor(props: ConfigEntryWidgetProps) {
        super(props);
    }

    onEntryChange = (entry: ConfigEntry, event: React.FormEvent<HTMLInputElement>) => {
        switch (entry.type) {
            case InputType.INTEGER:
                entry.value = Number.parseInt(event.currentTarget.value);
                break;
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
                < Control key={entry.label + "ctrl"} >
                    <Input
                        type="number"
                        step={entry.type === InputType.INTEGER ? "1" : "any"}
                        value={typeof (entry.value) === "number" ? entry.value : Number.parseInt("" + entry.value)
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
