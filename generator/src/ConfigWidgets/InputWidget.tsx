import * as React from "react";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { Form } from "react-bulma-components";

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
            <Form.Field key={entry.label + "field"}>
                <Form.Label key={entry.label + "key"}> {entry.label} </Form.Label>
                <Form.Control key={entry.label + "ctrl"} >
                    <Form.Input
                        type="text"
                        value={"" + entry.value}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => this.onEntryChange(entry, event)}
                    />
                    {entry.help && <Form.Help>{entry.help} </Form.Help>}
                </Form.Control>
            </Form.Field>
        );
    }
}
