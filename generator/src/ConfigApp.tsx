import * as React from "react";
import { Config, ConfigEntry } from "./ConfigApi";
import { applyEventToEntry, renderConfigPage } from "./ConfigWidgets";

interface ConfigAppState {
    config: Config;
    lastChange: number;
}

export class ConfigApp extends React.Component<{}, ConfigAppState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            config: {
                version: 0,
                panels: []
            },
            lastChange: Date.now()
        };
    }

    componentDidMount() {
        fetch("./config.json")
            .then(resp => resp.json())
            .then(config => {
                this.setState({ config });
            }).catch(() => this.setState({
                config: {
                    version: 0,
                    title: "config.json failed to load.",
                    panels: []
                }
            }));
    }

    render() {
        return renderConfigPage(this.state.config, this.onEntryChange, this.onSave);
    }

    onEntryChange = (entry: ConfigEntry, event: React.FormEvent<HTMLInputElement>) => {
        applyEventToEntry(entry, event);
        this.setState({ lastChange: Date.now() });
    }

    onSave = () => {
        // TODO
    }
}
