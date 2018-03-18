import * as React from "react";
import { Control } from "bloomer/lib/elements/Form/Control";
import { Field } from "bloomer/lib/elements/Form/Field/Field";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { Help } from "bloomer/lib/elements/Form/Help";
import { Button } from "bloomer/lib/elements/Button";
import { Input } from "bloomer/lib/elements/Form/Input";
import { Label } from "bloomer/lib/elements/Form/Label";
import { ConfigEntry } from "../ConfigApi";
import * as toastr from "toastr";

interface ApiButtonWidgetState extends ConfigEntryWidgetState {
    msg: string;
    label: string;
    isPreview: boolean;
}

export class ApiButtonWidget extends ConfigEntryWidget<ConfigEntryWidgetProps, ApiButtonWidgetState> {

    constructor(props: ConfigEntryWidgetProps) {
        super(props);
        this.state = { msg: "", label: props.entry.label, isPreview: false };
    }

    onValueChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.entry.value = event.currentTarget.value;
        this.props.onEntryChanged();
    }
    onLabelChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.entry.label = event.currentTarget.value;
        this.setState({ label: event.currentTarget.value });
    }

    componentWillReceiveProps(nextProps: ConfigEntryWidgetProps) {
        this.setState({ label: nextProps.entry.label });
    }

    getApi = () => {
        if (this.props.isInGeneratorApp) {
            if (this.state.isPreview) {
                toastr.info("Should HTTP GET \"" + this.props.entry.value + "\"");
            }
            this.setState({ msg: "json.msg will be printed here", isPreview: !this.state.isPreview });
        } else {
            if (typeof (this.props.entry.value) === "string") {
                this.setState({ label: "Executing ..." });
                fetch(this.props.entry.value, { method: "GET" })
                    .then(res => res.json())
                    .then(json => this.setState({ msg: json.msg, label: this.props.entry.label }))
                    .catch(e => this.setState({ msg: e, label: this.props.entry.label }));
            }
        }
    }

    renderEdits = (entry: ConfigEntry) => {
        return (
            <div key="configDiv">
                <Label isSize="small">
                    Button Label:
                    </Label>
                <Input
                    key="labelInput"
                    type="text"
                    isSize="small"
                    value={"" + entry.label}
                    onChange={this.onLabelChange}
                />
                <Label isSize="small">
                    HTTP GET path:
                    </Label>
                <Input
                    key="apiInput"
                    type="text"
                    isSize="small"
                    value={"" + entry.value}
                    onChange={this.onValueChange}
                />
            </div>
        );
    }

    render() {
        const entry = this.props.entry;
        return (
            <Field width="100%">
                <Control>
                    <Button onClick={this.getApi} style={{ width: "100%" }}>
                        {this.state.label}
                    </Button>
                    {this.state.msg && !this.state.isPreview ? <Help><b>Response: </b>{this.state.msg}</Help> : undefined}
                    <Help>{entry.help}</Help>

                    {this.props.isInGeneratorApp && this.state.isPreview && this.renderEdits(entry)}
                </Control>
            </Field >
        );
    }
}
