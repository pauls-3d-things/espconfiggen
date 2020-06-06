import * as React from "react";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { Form} from "react-bulma-components";

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
            <Form.Field key={entry.label + "field"}>
                <Form.Control>
                    <Form.Label>{entry.label} </Form.Label>
                    <Form.Checkbox
                        checked={entry.value === true}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => this.onEntryChange(entry, event)}
                        value={entry.help}
                    ><Form.Help>{entry.help}</Form.Help>
                    </Form.Checkbox>
                </Form.Control>
            </Form.Field>
        );
    }
}
