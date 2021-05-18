import * as React from "react";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { Label } from "trunx/component/Label"
import { Field } from "trunx/component/Field";
import { Control } from "trunx/component/Control";
import { Select } from "trunx/component/Select";

export class DropDownWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, ConfigEntryWidgetState> {

    constructor(props: ConfigEntryWidgetProps) {
        super(props);
    }

    onEntryChange = (entry: any, event: React.FormEvent<Element>) => {
        entry.value = (event.currentTarget as any).value;
        this.props.onEntryChanged();
    }

    render() {
        const entry = this.props.entry;
        return (
            <Field key={entry.label + "field"}>
                <Label key={entry.label + "key"}> {entry.label} </Label>
                <Control key={entry.label + "ctrl"}>

                    <Select onChange={(event: React.ChangeEvent) => this.onEntryChange(entry, event)}>
                        {entry.help && entry.help?.split(",").map(lbl => <option key={lbl} selected={entry.value == lbl}>{lbl}</option>)}
                    </Select>
                </Control>
            </Field>
        );
    }
}
