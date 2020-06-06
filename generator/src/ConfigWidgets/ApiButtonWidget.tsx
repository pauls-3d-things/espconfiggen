import * as React from "react";
import { ConfigEntryWidget, ConfigEntryWidgetProps, ConfigEntryWidgetState } from "./ConfigEntryWidget";
import { Button, Form} from "react-bulma-components";
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
                <Form.Label size="small">
                    Button Label:
                    </Form.Label>
                <Form.Input
                    key="labelInput"
                    type="text"
                    size="small"
                    value={"" + entry.label}
                    onChange={this.onLabelChange}
                />
                <Form.Label size="small">
                    HTTP GET path:
                    </Form.Label>
                <Form.Input
                    key="apiInput"
                    type="text"
                    size="small"
                    value={"" + entry.value}
                    onChange={this.onValueChange}
                />
            </div>
        );
    }

    render() {
        const entry = this.props.entry;
        return (
            <Form.Field style={{width:"100%"}} >
                <Form.Control>
                    <Button onClick={this.getApi} style={{ width: "100%" }}>
                        {this.state.label}
                    </Button>
                    {this.state.msg && !this.state.isPreview ? <Form.Help><b>Response: </b>{this.state.msg}</Form.Help> : undefined}
                    <Form.Help>{entry.help}</Form.Help>

                    {this.props.isInGeneratorApp && this.state.isPreview && this.renderEdits(entry)}
                </Form.Control>
            </Form.Field >
        );
    }
}
