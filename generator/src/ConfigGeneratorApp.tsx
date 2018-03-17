import * as React from "react";
import { Config, ConfigEntry, InputType, str2InputType, getDataFromConfig } from "./ConfigApi";
import {
    Label, Input, Control, Field, Select, Columns, Column, Button, Icon, Container,
    Card, CardHeader, CardContent, Tabs, TabList, Tab, TabLink, Navbar,
    NavbarItem, NavbarMenu, NavbarStart, NavbarEnd, NavbarLink, NavbarDropdown, CardHeaderTitle
} from "bloomer";
import { saveAs } from "file-saver";
import * as toastr from "toastr";
import MonacoEditor from "react-monaco-editor";
import { generateConfigCpp, generateConfigH, generateMainCpp } from "./CodeGenerator";
import { exampleHue, exampleNew, exampleTypes } from "./Examples";
import { renderConfigPage } from "./ConfigWidgets/ConfigPage";

enum SelectedTab {
    PREVIEW,
    CONFIG_JSON,
    CONFIG_CPP,
    CONFIG_H,
    MAIN_CPP
}

interface ConifgGeneratorAppState {
    config: Config;
    lastChange: number;
    selectedPanel: number;
    selectedItem: number;
    selectedTab: SelectedTab;

    jsonEditor: monaco.editor.ICodeEditor | null;
}

export class ConifgGeneratorApp extends React.Component<{}, ConifgGeneratorAppState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            config: {
                version: 0,
                title: "",
                panels: []
            },
            lastChange: Date.now(),
            selectedPanel: 0,
            selectedItem: 0,
            selectedTab: SelectedTab.PREVIEW,

            jsonEditor: null
        };
    }
    redraw = () => {
        this.setState({ lastChange: Date.now() });
    }

    updateTitle = (event: React.FormEvent<HTMLInputElement>) => {
        const config = this.state.config;
        config.title = event.currentTarget.value;
        this.setState({ config });
    }

    renderInputTypeItems(currentType: InputType): any {
        const options = [];

        for (let t in InputType) {
            if (isNaN(Number(t))) {
                options.push(
                    <option key={"type" + t} value={InputType[t]} selected={InputType[t] === currentType}>{t}</option>
                );
            }
        }
        return options;
    }

    renderConfigMain(): any {
        return (
            <div>
                <Field >
                    <Label isSize="small">Title</Label>
                    <Control>
                        <Input isSize="small"
                            type="text"
                            value={"" + this.state.config.title}
                            onChange={this.updateTitle}
                        />
                    </Control>
                </Field>
            </div>
        );
    }

    renderConfigPanel = () => {
        return (
            <div>
                <Label isSize="small">Panel:</Label>
                {!this.state.config.title ? <p>Please provide a title.</p> :
                    <div>
                        <Field>
                            <Control>
                                {!this.state.config.panels.length ? undefined :
                                    <Select isSize="small"
                                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                            this.setState({
                                                selectedPanel: Number.parseInt(event.currentTarget.value),
                                                selectedItem: 0
                                            });
                                            console.log("selected panel", event.currentTarget.value);

                                        }}>
                                        {this.state.config
                                            .panels.map((p, i) => <option value={i} selected={i === this.state.selectedPanel}>{p.title}</option>)}
                                    </Select>
                                }
                                <Button
                                    isSize="small"
                                    onClick={() => {
                                        this.state.config.panels.push({
                                            title: "Panel " + (this.state.config.panels.length + 1),
                                            entries: []
                                        });
                                        this.setState({ selectedPanel: this.state.config.panels.length - 1 });
                                    }}
                                ><Icon icon="plus" /></Button>
                            </Control>
                        </Field>

                        {!this.state.config.panels[this.state.selectedPanel] ? undefined :
                            <Field>
                                <Label isSize="small">Title:</Label>
                                <Control>
                                    <Input
                                        isSize="small"
                                        type="text"
                                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                            this.state.config.panels[this.state.selectedPanel].title = event.currentTarget.value;
                                            this.redraw();
                                        }}
                                        value={this.state.config.panels[this.state.selectedPanel].title}
                                    />
                                </Control>
                            </Field>
                        }
                    </div>
                }
            </div>
        );
    }

    renderItemConfigDetail = (currentItem: ConfigEntry) => {
        return ([
            <Field>
                <Label isSize="small">Label:</Label>
                <Control>
                    <Input
                        isSize="small"
                        type="text"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            currentItem.label = event.currentTarget.value;
                            this.redraw();
                        }}
                        value={currentItem.label}
                    />
                </Control>
            </Field>,
            <Field>
                <Label isSize="small">Type:</Label>
                <Control>
                    <Select
                        isSize="small"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            console.log("selected type", event.currentTarget.value);
                            const newType = str2InputType(event.currentTarget.value);
                            this.state.config.panels[this.state.selectedPanel]
                                .entries[this.state.selectedItem].type = newType;
                            this.redraw();
                        }}>
                        {this.renderInputTypeItems(currentItem.type)}
                    </Select>
                </Control>
            </Field>,
            <Field>
                <Label isSize="small">Help text:</Label>
                <Control>
                    <Input
                        isSize="small"
                        type="text"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            currentItem.help = event.currentTarget.value;
                            this.redraw();
                        }} value={this.state.config.panels[this.state.selectedPanel]
                            .entries[this.state.selectedItem].help}
                    />
                </Control>
            </Field>
        ]);
    }
    renderConfigItem = (currentItem: ConfigEntry): any => {
        return (
            <div>
                <Field>
                    <Label isSize="small">Item:</Label>
                    {this.state.config.panels.length === 0 ? <p>Please add a panel.</p> :
                        <Control>
                            {!currentItem ? undefined :
                                <Select isSize="small"
                                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                        this.setState({ selectedItem: Number.parseInt(event.currentTarget.value) });
                                        console.log("selected item", event.currentTarget.value);

                                    }}>
                                    {this.state.config.panels[this.state.selectedPanel]
                                        .entries.map((e, i) => <option value={i} selected={i === this.state.selectedItem}>{e.label}</option>)}
                                </Select>}
                            <Button
                                isSize="small"
                                onClick={() => {
                                    this.state.config.panels[this.state.selectedPanel]
                                        .entries.push({
                                            label: "Item " + (this.state.config.panels[this.state.selectedPanel].entries.length + 1),
                                            help: "",
                                            type: InputType.INTEGER,
                                            value: ""
                                        });
                                    this.setState({ selectedItem: this.state.config.panels[this.state.selectedPanel].entries.length - 1 });
                                }}
                            ><Icon icon="plus" /></Button>
                        </Control>
                    }
                </Field>
                {!currentItem ? undefined : this.renderItemConfigDetail(currentItem)}
            </div>
        );
    }

    saveFile = (content: string, name: string) => {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        saveAs(blob, name);
    }

    renderMainTabs = () => {
        return (<Tabs>
            <TabList>
                {[
                    { lbl: "UI", tab: SelectedTab.PREVIEW, ico: "fa fa-eye" },
                    { lbl: "config.json", tab: SelectedTab.CONFIG_JSON, ico: "fa fa-edit" },
                    { lbl: "Config.cpp", tab: SelectedTab.CONFIG_CPP, ico: "fa fa-code" },
                    { lbl: "Config.h", tab: SelectedTab.CONFIG_H, ico: "fa fa-code" },
                    { lbl: "main.cpp", tab: SelectedTab.MAIN_CPP, ico: "fa fa-code" }
                ].map(e =>
                    <Tab isActive={this.state.selectedTab === e.tab} onClick={() => this.setState({ selectedTab: e.tab })}>
                        <TabLink>
                            <Icon isSize="small"><span className={e.ico} /></Icon>
                            <span>{e.lbl}</span>
                        </TabLink>
                    </Tab>)}
            </TabList>
        </Tabs >);
    }

    onJsonChange = (updatedJson: string) => {
        console.log("changed", updatedJson);
        try {
            const updatedConfig = JSON.parse(updatedJson);
            // if parsing worked: update model
            this.setState({ config: updatedConfig });
        } catch (e) {
            // else do nothing
        }
    }

    renderJson = () => {
        return (
            <Field>
                {/* <Label></Label> */}
                <Control>
                    <MonacoEditor
                        width="100%"
                        height="500"
                        language="json"
                        theme="vs-light"
                        value={JSON.stringify(this.state.config, undefined, 2)}
                        options={{
                            selectOnLineNumbers: true
                        }}
                        onChange={this.onJsonChange}
                        editorDidMount={(editor: monaco.editor.ICodeEditor) => {
                            editor.focus();
                            this.setState({ jsonEditor: editor });
                        }}
                    />
                </Control>
            </Field>
        );
    }

    renderCpp = () => {
        return (
            <Field>
                <Control>
                    <MonacoEditor
                        width="100%"
                        height="500"
                        language="cpp"
                        theme="vs-light"
                        value={generateConfigCpp(this.state.config)}
                        options={{
                            readOnly: true,
                            selectOnLineNumbers: true
                        }}
                        onChange={undefined}
                        editorDidMount={(editor: monaco.editor.ICodeEditor) => {
                            editor.focus();
                        }}
                    />
                </Control>
            </Field>
        );
    }

    renderMainCpp = () => {
        return (
            <Field>
                <Control>
                    <MonacoEditor
                        width="100%"
                        height="500"
                        language="cpp"
                        theme="vs-light"
                        value={generateMainCpp(this.state.config)}
                        options={{
                            readOnly: true,
                            selectOnLineNumbers: true
                        }}
                        onChange={undefined}
                        editorDidMount={(editor: monaco.editor.ICodeEditor) => {
                            editor.focus();
                        }}
                    />
                </Control>
            </Field>
        );
    }

    renderH = () => {
        return (
            <Field>
                <Control>
                    <MonacoEditor
                        width="100%"
                        height="500"
                        language="cpp"
                        theme="vs-light"
                        value={generateConfigH(this.state.config)}
                        options={{
                            readOnly: true,
                            selectOnLineNumbers: true
                        }}
                        onChange={undefined}
                        editorDidMount={(editor: monaco.editor.ICodeEditor) => {
                            editor.focus();
                        }}
                    />
                </Control>
            </Field>
        );
    }

    onPreviewSave = () => {
        const data = getDataFromConfig(this.state.config);
        console.log(data);
        toastr.success("Saved.", "This was just simulated.");
    }

    renderNavBar = () => {
        return (
            <Navbar className="espconfiggen_navbar">
                <NavbarMenu>
                    <NavbarStart>
                        <NavbarItem>ESP Config Generator</NavbarItem>
                        {this.renderNavFile()}
                        {this.renderNavDownload()}
                    </NavbarStart>
                    <NavbarEnd>
                        <NavbarItem href="https://github.com/uvwxy/espconfiggen" target="_blank" isHidden="touch">
                            <Icon className="fa fa-github" />
                        </NavbarItem>
                        <NavbarItem href="https://thingiverse.com/uvwxy" target="_blank" isHidden="touch">
                            <Icon className="fa fa-cubes" />
                        </NavbarItem>
                        <NavbarItem href="https://www.instagram.com/pauls_3d_things" target="_blank" isHidden="touch">
                            <Icon className="fa fa-instagram" />
                        </NavbarItem>
                    </NavbarEnd>
                </NavbarMenu>
            </Navbar>
        );
    }

    renderNavDownload = () => {
        return (
            <NavbarItem hasDropdown isHoverable>
                <NavbarLink href="#">Download</NavbarLink>
                <NavbarDropdown>
                    {
                        [{ lbl: "config.json", fn: () => this.saveFile(JSON.stringify(this.state.config), "config.json") },
                        { lbl: "Config.cpp", fn: () => this.saveFile(generateConfigCpp(this.state.config), "Config.cpp") },
                        { lbl: "Config.h", fn: () => this.saveFile(generateConfigH(this.state.config), "Config.h") },
                        { lbl: "main.cpp", fn: () => this.saveFile(generateMainCpp(this.state.config), "main.cpp") }

                            // { lbl: "data.zip", fn: null }
                        ].map(e => <NavbarItem key={e.lbl} onClick={e.fn} href="#">{e.lbl}</NavbarItem>)
                    }
                </NavbarDropdown>
            </NavbarItem>
        );
    }

    renderNavFile = () => {
        return (
            <NavbarItem hasDropdown isHoverable>
                <NavbarLink href="#">File</NavbarLink>
                <NavbarDropdown>
                    {
                        [{ lbl: "New", cfg: exampleNew },
                        { lbl: "Available Types", cfg: exampleTypes },
                        { lbl: "Hue Example", cfg: exampleHue }
                        ].map(e => <NavbarItem key={e.lbl} onClick={() => this.setState({ config: e.cfg as Config })} href="#">{e.lbl}</NavbarItem>)
                    }
                </NavbarDropdown>
            </NavbarItem>
        );
    }
    render() {
        const currentItem = this.state.config.panels[this.state.selectedPanel]
            && this.state.config.panels[this.state.selectedPanel].entries[this.state.selectedItem];
        return (
            <div>
                {this.renderNavBar()}
                <Container>
                    <Columns>
                        <Column isSize={2}>
                            <Card>
                                <CardHeader>
                                    <CardHeaderTitle>
                                        Edit
                                   </CardHeaderTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        {this.renderConfigMain()}
                                        <hr />
                                        {this.renderConfigPanel()}
                                        <hr />
                                        {this.renderConfigItem(currentItem)}
                                    </div>
                                </CardContent>
                            </Card>
                        </Column>
                        <Column isSize={10}>
                            <Card>
                                <CardHeader>
                                    {this.renderMainTabs()}
                                </CardHeader>
                                <CardContent style={{ overflow: "scroll" }}>
                                    {this.state.selectedTab === SelectedTab.PREVIEW && renderConfigPage(this.state.config, this.redraw, true, this.onPreviewSave)}
                                    {this.state.selectedTab === SelectedTab.CONFIG_JSON && this.renderJson()}
                                    {this.state.selectedTab === SelectedTab.CONFIG_CPP && this.renderCpp()}
                                    {this.state.selectedTab === SelectedTab.CONFIG_H && this.renderH()}
                                    {this.state.selectedTab === SelectedTab.MAIN_CPP && this.renderMainCpp()}
                                </CardContent>
                            </Card>
                        </Column>
                    </Columns>
                </Container>
            </div >
        );
    }

}
