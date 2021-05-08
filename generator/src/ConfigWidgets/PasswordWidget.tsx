import * as React from "react";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { Input } from "trunx/component/Input"
import { Label } from "trunx/component/Label"
import { Field } from "trunx/component/Field";
import { Control } from "trunx/component/Control";
import { Help } from "trunx/component/Help";

export class PasswordWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, ConfigEntryWidgetState> {

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
                        type="password"
                        value={"" + entry.value}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => this.onEntryChange(entry, event)}
                    />
                    {entry.help && <Help>{entry.help} </Help>}
                </Control>
            </Field>
        );
    }
}
