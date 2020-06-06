import * as React from "react";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { InputType, ConfigEntry } from "../ConfigApi";
import { Form } from "react-bulma-components";

export class NumberWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, ConfigEntryWidgetState> {

    constructor(props: ConfigEntryWidgetProps) {
        super(props);
    }

    onEntryChange = (entry: ConfigEntry, event: React.FormEvent<HTMLInputElement>) => {
        switch (entry.type) {
            case InputType.INTEGER:
                entry.value = Number.parseInt(event.currentTarget.value, 10);
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
            <Form.Field key={entry.label + "field"}>
                <Form.Label>{entry.label} </Form.Label>
                <Form.Control key={entry.label + "ctrl"} >
                    <Form.Input
                        type="number"
                        step={entry.type === InputType.INTEGER ? "1" : "any"}
                        value={typeof (entry.value) === "number" ? "" + entry.value : "" + Number.parseInt("" + entry.value, 10)
                        }
                        onChange={(event: React.FormEvent<HTMLInputElement>) => this.onEntryChange(entry, event)}
                    />
                    {
                        entry.help && <Form.Help>{entry.help} </Form.Help>}
                </Form.Control>
            </Form.Field>
        );
    }
}
