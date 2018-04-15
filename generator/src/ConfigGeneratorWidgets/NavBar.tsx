import * as React from "react";
import { Navbar } from "bloomer/lib/components/Navbar/Navbar";
import { NavbarMenu } from "bloomer/lib/components/Navbar/NavbarMenu";
import { NavbarStart } from "bloomer/lib/components/Navbar/NavbarStart";
import { NavbarItem } from "bloomer/lib/components/Navbar/NavbarItem";
import { NavbarEnd } from "bloomer/lib/components/Navbar/NavbarEnd";
import { NavbarLink } from "bloomer/lib/components/Navbar/NavbarLink";
import { NavbarDropdown } from "bloomer/lib/components/Navbar/NavbarDropdown";
import { Icon } from "bloomer/lib/elements/Icon";
import { generateConfigCpp, generateConfigH, generateMainCpp } from "../CodeGenerator";
import { Config } from "../ConfigApi";
import { exampleNew, exampleTypes, exampleHue, exampleWifiSetup } from "../Examples";
import { saveAs } from "file-saver";
import { NavbarBrand } from "bloomer/lib/components/Navbar/NavbarBrand";
import { NavbarBurger } from "bloomer/lib/components/Navbar/NavbarBurger";

export const saveFile = (content: string, name: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, name);
};

export const renderNavDownload = (config: Config) => {
    return (
        <NavbarItem hasDropdown isHoverable >
            <NavbarLink href="#" > Download </NavbarLink>
            < NavbarDropdown >
                {
                    [{ lbl: "config.json", fn: () => saveFile(JSON.stringify(config), "config.json"), href: "#" },
                    { lbl: "Config.cpp", fn: () => saveFile(generateConfigCpp(config), "Config.cpp"), href: "#" },
                    { lbl: "Config.h", fn: () => saveFile(generateConfigH(config), "Config.h"), href: "#" },
                    { lbl: "main.cpp", fn: () => saveFile(generateMainCpp(config), "main.cpp"), href: "#" },
                    { lbl: "data.zip", fn: undefined, href: "./data.zip" }

                        // { lbl: "data.zip", fn: null }
                    ].map(e => <NavbarItem key={e.lbl} onClick={e.fn} href={e.href} > {e.lbl} </NavbarItem>)
                }
            </NavbarDropdown>
        </NavbarItem>
    );
};

export const renderNavFile = (onNavSelect: (config: Config) => void) => {
    return (
        <NavbarItem hasDropdown isHoverable >
            <NavbarLink href="#" > File </NavbarLink>
            < NavbarDropdown >
                {
                    [{ lbl: "New", cfg: exampleNew },
                    { lbl: "Available Types", cfg: exampleTypes },
                    { lbl: "Hue Example", cfg: exampleHue },
                    { lbl: "Wifi Setup Example", cfg: exampleWifiSetup },
                    ].map(e => <NavbarItem key={e.lbl} onClick={() => onNavSelect(e.cfg as Config)} href="#" > {e.lbl} </NavbarItem>)
                }
            </NavbarDropdown>
        </NavbarItem >
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
            <NavbarItem key="github" href="https://github.com/uvwxy/espconfiggen" target="_blank" className={"is-hidden-" + hidden}>
                <Icon className="fa fa-github" />
            </NavbarItem>,
            < NavbarItem key="cubes" href="https://thingiverse.com/uvwxy" target="_blank" className={"is-hidden-" + hidden}>
                <Icon className="fa fa-cubes" />
            </NavbarItem>,
            <NavbarItem key="insta " href="https://www.instagram.com/pauls_3d_things" target="_blank" className={"is-hidden-" + hidden}>
                <Icon className="fa fa-instagram" />
            </NavbarItem>
        ]);
    }
    render() {
        return (
            <Navbar className="espconfiggen_navbar" >
                <NavbarBrand>
                    <NavbarItem>
                        ESP Config Generator
                     </NavbarItem>
                    {this.socialIcons("desktop")}
                    <NavbarBurger isActive={this.state.isActive} onClick={this.onClickNav} />
                </NavbarBrand>
                <NavbarMenu isActive={this.state.isActive}>
                    <NavbarStart>
                        {/* <NavbarItem>ESP Config Generator </NavbarItem> */}
                        {renderNavFile(this.props.onNavSelect)}
                        {renderNavDownload(this.props.config)}
                    </NavbarStart>
                    <NavbarEnd>
                        {this.socialIcons("touch")}
                    </NavbarEnd>
                </NavbarMenu>
            </Navbar>
        );
    }
}
