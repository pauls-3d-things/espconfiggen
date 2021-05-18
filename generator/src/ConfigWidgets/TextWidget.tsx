import * as React from "react";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { Label } from "trunx/component/Label"
import { Field } from "trunx/component/Field";
import { Control } from "trunx/component/Control";
import { Help } from "trunx/component/Help";
export class TextWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, ConfigEntryWidgetState> {

    constructor(props: ConfigEntryWidgetProps) {
        super(props);
    }

    render() {
        const entry = this.props.entry;
        return (
            <Field key={entry.label + "field"}>
                <Label>{entry.label}</Label>
                <Control key={entry.label + "ctrl"} >
                    <text>
                        {entry.value}
                    </text>
                    {entry.help && <Help>{entry.help} </Help>}
                </Control>
            </Field>
        );
    }
}
