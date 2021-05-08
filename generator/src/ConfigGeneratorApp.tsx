import * as React from "react";
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { Config, ConfigEntry, InputType, str2InputType, getDataFromConfig, value2InputType } from "./ConfigApi";
import MonacoEditor from "react-monaco-editor";
import { generateConfigCpp, generateConfigH, generateMainCpp } from "./CodeGenerator";
import { renderConfigPage } from "./ConfigWidgets/ConfigPage";
import { ConfigGenNavbar } from "./ConfigGeneratorWidgets/NavBar";

import { Tabs } from "trunx/component/Tabs";
import { Button } from "trunx/component/Button";
import { Icon } from "trunx/component/Icon";
import { Input } from "trunx/component/Input";
import { Label } from "trunx/component/Label";
import { Field } from "trunx/component/Field";
import { Control } from "trunx/component/Control";
import { Select } from "trunx/component/Select";
import { Container } from "trunx/component/Container";
import { Columns } from "trunx/component/Columns";
import { Column } from "trunx/component/Column";
import { Card } from "trunx/component/Card";

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

    jsonEditor: monacoEditor.editor.ICodeEditor | null;
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
                    <option key={"type" + t} value={t}>{t}</option>
                );
            }
        }
        return options;
    }

    renderConfigMain(): any {
        return (
            <div>
                <Field >
                    <Label isSmall>Title</Label>
                    <Control>
                        <Input isSmall
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
                <Label isSmall>Panel:</Label>
                {!this.state.config.title ? <p style={{ fontSize: "small" }} >Please provide a title.</p> :
                    <div>
                        <Field>
                            <Control>
                                {!this.state.config.panels.length ? undefined :
                                    <Select isSmall
                                        value={this.state.selectedPanel}
                                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                            this.setState({
                                                selectedPanel: Number.parseInt(event.currentTarget.value, 10),
                                                selectedItem: 0
                                            });
                                            console.log("selected panel", event.currentTarget.value);

                                        }}>
                                        {this.state.config
                                            .panels.map((p, i) => <option value={i}>{p.title}</option>)}
                                    </Select>
                                }
                                <Button
                                    isSmall
                                    onClick={() => {
                                        this.state.config.panels.push({
                                            title: "Panel " + (this.state.config.panels.length + 1),
                                            entries: []
                                        });
                                        this.setState({ selectedPanel: this.state.config.panels.length - 1 });
                                    }}
                                ><Icon className="fa fa-plus" /></Button>
                            </Control>
                        </Field>

                        {!this.state.config.panels[this.state.selectedPanel] ? undefined :
                            <Field>
                                <Label isSmall>Title:</Label>
                                <Control>
                                    <Input
                                        isSmall
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
        console.log(currentItem);
        return ([
            <Field>
                <Label isSmall>Label:</Label>
                <Control>
                    <Input
                        isSmall
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
                <Label isSmall>Type:</Label>
                <Control>
                    <Select
                        isSmall
                        value={value2InputType(currentItem.type)}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
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
                <Label isSmall>Help text:</Label>
                <Control>
                    <Input
                        isSmall
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
                    <Label isSmall>Item:</Label>
                    {this.state.config.panels.length === 0 ? <p>Please add a panel.</p> :
                        <Control>
                            {!currentItem ? undefined :
                                <Select isSmall
                                    value={this.state.selectedItem}
                                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                        this.setState({ selectedItem: Number.parseInt(event.currentTarget.value, 10) });
                                        console.log("selected item", event.currentTarget.value);

                                    }}>
                                    {this.state.config.panels[this.state.selectedPanel]
                                        .entries.map((e, i) => <option value={i} >{e.label}</option>)}
                                </Select>}
                            <Button
                                isSmall
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
                            ><Icon className="fa fa-plus" /></Button>
                        </Control>
                    }
                </Field>
                {!currentItem ? undefined : this.renderItemConfigDetail(currentItem)}
            </div>
        );
    }

    renderMainTabs = () => {
        return (<Tabs>
            <ul>
                {[
                    { lbl: "UI", tab: SelectedTab.PREVIEW, ico: "fa fa-eye" },
                    { lbl: "config.json", tab: SelectedTab.CONFIG_JSON, ico: "fa fa-edit" },
                    { lbl: "Config.cpp", tab: SelectedTab.CONFIG_CPP, ico: "fa fa-code" },
                    { lbl: "Config.h", tab: SelectedTab.CONFIG_H, ico: "fa fa-code" },
                    { lbl: "main.cpp", tab: SelectedTab.MAIN_CPP, ico: "fa fa-code" }
                ].map(e => <li className={this.state.selectedTab === e.tab ? "is-active" : ""}
                    onClick={() => this.setState({ selectedTab: e.tab })}>
                    <a> <Icon isSmall><span className={e.ico} /></Icon>
                        <span>{e.lbl}</span></a>
                </li>
                )
                }
            </ul>
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
                        editorDidMount={(editor: monacoEditor.editor.ICodeEditor) => {
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
                        editorDidMount={(editor: monacoEditor.editor.ICodeEditor) => {
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
                        editorDidMount={(editor: monacoEditor.editor.ICodeEditor) => {
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
                        editorDidMount={(editor: monacoEditor.editor.ICodeEditor) => {
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
        console.log("Saved.", "This was just simulated."); // TODO: notify
    }

    render() {
        const currentItem = this.state.config.panels[this.state.selectedPanel]
            && this.state.config.panels[this.state.selectedPanel].entries[this.state.selectedItem];
        return (
            <div>
                <ConfigGenNavbar config={this.state.config} onNavSelect={(config: Config) => this.setState({ config })} />
                <Container>
                    <Columns>
                        <Column is2>
                            <Card>
                                <Card.Header>
                                    <Card.Header.Title>
                                        Edit
                                   </Card.Header.Title>
                                </Card.Header>
                                <Card.Content>
                                    <div>
                                        {this.renderConfigMain()}
                                        <hr />
                                        {this.renderConfigPanel()}
                                        <hr />
                                        {this.renderConfigItem(currentItem)}
                                    </div>
                                </Card.Content>
                            </Card>
                        </Column>
                        <Column is8>
                            <Card>
                                <Card.Header>
                                    {this.renderMainTabs()}
                                </Card.Header>
                                <Card.Content style={{ overflow: "scroll" }}>
                                    {this.state.selectedTab === SelectedTab.PREVIEW && renderConfigPage(this.state.config, this.redraw, true, this.onPreviewSave, true)}
                                    {this.state.selectedTab === SelectedTab.CONFIG_JSON && this.renderJson()}
                                    {this.state.selectedTab === SelectedTab.CONFIG_CPP && this.renderCpp()}
                                    {this.state.selectedTab === SelectedTab.CONFIG_H && this.renderH()}
                                    {this.state.selectedTab === SelectedTab.MAIN_CPP && this.renderMainCpp()}
                                </Card.Content>
                            </Card>
                        </Column>
                    </Columns>
                </Container>
            </div >
        );
    }

}
