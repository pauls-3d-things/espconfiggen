import * as React from "react";
import { ConfigEntry } from "../ConfigApi";

export interface ConfigEntryWidgetProps {
    isInGeneratorApp: boolean;
    onEntryChanged: () => void;
    entry: ConfigEntry;
}

export interface ConfigEntryWidgetState {

}

export class ConfigEntryWidget<P extends ConfigEntryWidgetProps, S extends ConfigEntryWidgetState> extends React.Component<P, S> {

    constructor(props: ConfigEntryWidgetProps & P) {
        super(props);
    }

    render() {
        return (
            <div>Widget not implemented: {this.props.entry.label} ({this.props.entry.type}) </div>
        );
    }
}
