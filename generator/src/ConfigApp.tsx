import * as React from "react";
import { Config, getDataFromConfig, applyDataToConfig, oswConfigToConfig, OswConfig, configDataToOswData, ConfigData, OswData } from "./ConfigApi";
import { renderConfigPage } from "./ConfigWidgets/ConfigPage";

interface ConfigAppState {
    config: Config;
    lastChange: number;
    saveEnabled: boolean;
    info?: string;
    oswConfig?: OswConfig;
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
            saveEnabled: true,
            info: ""
        };
        (window as any).setInfoMessage = (info: string) => this.setState({ info });
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
                    if (config.entries) {
                        this.setState({ config: oswConfigToConfig(config), oswConfig: config })
                    } else {
                        this.setState({ config }); // display initial screen with defaults
                        return fetchData();
                    }
                } else {
                    console.log(config);
                }
            })
            .catch((e) => {
                console.log("Error loading config", e);
            });
    }

    redraw = () => {
        this.setState({ lastChange: Date.now() });
    }

    onSave = () => {
        this.setState({ saveEnabled: false });

        var data: OswData | ConfigData = getDataFromConfig(this.state.config);

        // convert to OSW Config Data format if required
        if (this.state.oswConfig) {
            data = configDataToOswData(data, this.state.oswConfig);
        }

        fetch("/data.json", {
            method: "POST",
            body: JSON.stringify(data)
        }).then(resp => resp.json()).then((json: any) => {
            this.setState({ saveEnabled: true });
            if (json.success) {
                (window as any).setInfoMessage("Saved.");
            } else {
                (window as any).setInfoMessage("Error: " + json.error);
            }
        }).catch(e => {
            (window as any).setInfoMessage("Error: " + e);
            this.setState({ saveEnabled: true });
        });
    }

    render() {
        if (this.state.info) {
            setTimeout(() => this.setState({ info: "" }), 10 * 1000);
        }
        return renderConfigPage(this.state.config, this.redraw, this.state.saveEnabled, this.onSave, false, this.state.info);
    }

}
