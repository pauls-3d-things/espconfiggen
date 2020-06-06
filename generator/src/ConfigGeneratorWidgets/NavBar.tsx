import * as React from "react";
import { generateConfigCpp, generateConfigH, generateMainCpp } from "../CodeGenerator";
import { Config } from "../ConfigApi";
import { exampleNew, exampleTypes, exampleHue, exampleWifiSetup } from "../Examples";
import { saveAs } from "file-saver";
import { Navbar, Icon } from "react-bulma-components";

export const saveFile = (content: string, name: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, name);
};

export const renderNavDownload = (config: Config) => {
    return (
        <Navbar.Item dropdown={true} hoverable={true} >
            <Navbar.Link> Download </Navbar.Link>
            < Navbar.Dropdown >
                {
                    [{ lbl: "config.json", fn: () => saveFile(JSON.stringify(config), "config.json"), href: "#" },
                    { lbl: "Config.cpp", fn: () => saveFile(generateConfigCpp(config), "Config.cpp"), href: "#" },
                    { lbl: "Config.h", fn: () => saveFile(generateConfigH(config), "Config.h"), href: "#" },
                    { lbl: "main.cpp", fn: () => saveFile(generateMainCpp(config), "main.cpp"), href: "#" },
                    { lbl: "data.zip", fn: undefined, href: "./data.zip" }

                        // { lbl: "data.zip", fn: null }
                    ].map(e => <Navbar.Item key={e.lbl} onClick={e.fn} > {e.lbl} </Navbar.Item>)
                }
            </Navbar.Dropdown>
        </Navbar.Item>
    );
};

export const renderNavFile = (onNavSelect: (config: Config) => void) => {
    return (
        <Navbar.Item dropdown={true} hoverable={true} >
            <Navbar.Link> File </Navbar.Link>
            < Navbar.Dropdown >
                {
                    [{ lbl: "New", cfg: exampleNew },
                    { lbl: "Available Types", cfg: exampleTypes },
                    { lbl: "Hue Example", cfg: exampleHue },
                    { lbl: "Wifi Setup Example", cfg: exampleWifiSetup }
                    ].map(e => <Navbar.Item key={e.lbl} onClick={() => onNavSelect(e.cfg as Config)} > {e.lbl} </Navbar.Item>)
                }
            </Navbar.Dropdown>
        </Navbar.Item >
    );
};

export interface ConfigGenNavbarProps {
    config: Config;
    onNavSelect: (config: Config) => void;
}
export interface ConfigGenNavbarState {
    isActive: boolean;
}
export class ConfigGenNavbar extends React.Component<ConfigGenNavbarProps, ConfigGenNavbarState> {
    constructor(props: ConfigGenNavbarProps) {
        super(props);
        this.state = { isActive: false };
    }
    onClickNav = () => {
        this.setState({ isActive: !this.state.isActive });
    }

    socialIcons = (hidden: string) => {
        return ([
            <Navbar.Item key="home" onClick={() => window.open("https://p3dt.net", "_blank")} className={"is-hidden-" + hidden}>
                <Icon className="fa fa-home" />
            </Navbar.Item>,
            <Navbar.Item key="github" onClick={() => window.open("https://github.com/uvwxy/espconfiggen", "_blank")} className={"is-hidden-" + hidden}>
                <Icon className="fa fa-github" />
            </Navbar.Item>,
            <Navbar.Item key="insta " onClick={() => window.open("https://www.instagram.com/pauls_3d_things", "_blank")} className={"is-hidden-" + hidden}>
                <Icon className="fa fa-instagram" />
            </Navbar.Item>
        ]);
    }
    render() {
        return (
            <Navbar className="espconfiggen_navbar" >
                <Navbar.Brand>
                    <Navbar.Item>
                        ESP Config Generator
                     </Navbar.Item>
                    {this.socialIcons("desktop")}
                    <Navbar.Burger  onClick={this.onClickNav} />
                </Navbar.Brand>
                <Navbar.Menu>
                    <Navbar.Menu className="navbar-start">
                        {/* <Navbar.Item>ESP Config Generator </Navbar.Item> */}
                        {renderNavFile(this.props.onNavSelect)}
                        {renderNavDownload(this.props.config)}
                    </Navbar.Menu>
                    <Navbar.Menu className="navbar-end">
                        {this.socialIcons("touch")}
                    </Navbar.Menu>
                </Navbar.Menu>
            </Navbar>
        );
    }
}
