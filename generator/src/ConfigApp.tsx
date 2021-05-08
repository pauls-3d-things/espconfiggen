import * as React from "react";
import { Config, getDataFromConfig, applyDataToConfig } from "./ConfigApi";
import * as toastr from "toastr";
import { renderConfigPage } from "./ConfigWidgets/ConfigPage";

interface ConfigAppState {
    config: Config;
    lastChange: number;
    saveEnabled: boolean;
}

export class ConfigApp extends React.Component<{}, ConfigAppState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            config: {
                version: 0,
                panels: []
            },
            lastChange: Date.now(),
            saveEnabled: true
        };
    }

    componentDidMount() {
        const fetchData = () => fetch("/data.json", { method: "GET" })
            .then(resp => resp.json())
            .then(data => {
                // TODO: detect flattened list of data and recreate maps of maps
                if (!data.error) {
                    applyDataToConfig(this.state.config, data);
                    this.setState({ lastChange: Date.now() }); // trigger redraw of loaded data
                } else {
                    console.log(data);
                }
            });

        fetch("./config.json")
            .then(resp => resp.json())
            .then(config => {
                // TODO: in case of a single list recreate the map using section labels^
                if (!config.error) {
                    this.setState({ config }); // display initial screen with defaults
                } else {
                    console.log(config);
                }
            })
            .then(fetchData)
            .catch((e) => {
                toastr.error("Error loading config", e);
            });
    }

    redraw = () => {
        this.setState({ lastChange: Date.now() });
    }

    onSave = () => {
        this.setState({ saveEnabled: false });

        const data = getDataFromConfig(this.state.config);
        fetch("/data.json", {
            method: "POST",
            body: JSON.stringify(data)
        }).then(resp => resp.json()).then((json: any) => {
            this.setState({ saveEnabled: true });
            if (json.success) {
                toastr.success("Saved.");
            } else {
                toastr.error("Error", json.error);
            }
        }).catch(e => {
            toastr.error("Error", e);
            this.setState({ saveEnabled: true });
        });
    }

    render() {
        return renderConfigPage(this.state.config, this.redraw, this.state.saveEnabled, this.onSave, false);
    }

}
