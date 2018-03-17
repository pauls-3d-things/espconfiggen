import * as React from "react";
import { Control } from "bloomer/lib/elements/Form/Control";
import { Label } from "bloomer/lib/elements/Form/Label";
import { Checkbox } from "bloomer/lib/elements/Form/Checkbox";
import { Field } from "bloomer/lib/elements/Form/Field/Field";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { Help } from "bloomer/lib/elements/Form/Help";

export class CheckboxWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, ConfigEntryWidgetState> {

    constructor(props: ConfigEntryWidgetProps) {
        super(props);
    }

    onEntryChange = (entry: any, event: React.FormEvent<HTMLInputElement>) => {
        entry.value = !entry.value;
        this.props.onEntryChanged();
    }

    render() {
        const entry = this.props.entry;
        return (
            <Field key={entry.label + "field"}>
                <Control>
                    <Label>{entry.label} </Label>
                    <Checkbox
                        checked={entry.value === true}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => this.onEntryChange(entry, event)}
                        value={entry.help}
                    ><Help>{entry.help}</Help>
                    </Checkbox>
                </Control>
            </Field>
        );
    }
}
