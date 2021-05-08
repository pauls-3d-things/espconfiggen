import * as React from "react";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { ConfigEntry } from "../ConfigApi";
import { Button } from "trunx/component/Button"
import { Input } from "trunx/component/Input"
import { Label } from "trunx/component/Label"
import { Field } from "trunx/component/Field";
import { Control } from "trunx/component/Control";
import { Help } from "trunx/component/Help";

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
                console.log("Should HTTP GET \"" + this.props.entry.value + "\""); // TODO: notify
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
                <Label isSmall>
                    Button Label:
                    </Label>
                <Input
                    key="labelInput"
                    type="text"
                    isSmall
                    value={"" + entry.label}
                    onChange={this.onLabelChange}
                />
                <Label isSmall>
                    HTTP GET path:
                    </Label>
                <Input
                    key="apiInput"
                    type="text"
                    isSmall
                    value={"" + entry.value}
                    onChange={this.onValueChange}
                />
            </div>
        );
    }

    render() {
        const entry = this.props.entry;
        return (
            <Field style={{ width: "100%" }} >
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
