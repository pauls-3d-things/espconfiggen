import * as React from "react";
import { Label } from "bloomer/lib/elements/Form/Label";
import { Control } from "bloomer/lib/elements/Form/Control";
import { Input } from "bloomer/lib/elements/Form/Input";
import { Help } from "bloomer/lib/elements/Form/Help";
import { Field } from "bloomer/lib/elements/Form/Field/Field";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";

export class InputWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, ConfigEntryWidgetState> {

    constructor(props: ConfigEntryWidgetProps) {
        super(props);
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
                        type="text"
                        value={"" + entry.value}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => this.onEntryChange(entry, event)}
                    />
                    {entry.help && <Help>{entry.help} </Help>}
                </Control>
            </Field>
        );
    }
}
