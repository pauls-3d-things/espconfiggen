import * as React from "react";
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { Config, ConfigEntry, InputType, str2InputType, getDataFromConfig } from "./ConfigApi";
import * as toastr from "toastr";
import MonacoEditor from "react-monaco-editor";
import { generateConfigCpp, generateConfigH, generateMainCpp } from "./CodeGenerator";
import { renderConfigPage } from "./ConfigWidgets/ConfigPage";
import { ConfigGenNavbar } from "./ConfigGeneratorWidgets/NavBar";
import { Form, Icon, Tabs, Container, Columns, Card, Button } from "react-bulma-components";

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
                    <option key={"type" + t} value={t} selected={t === currentType}>{t}</option>
                );
            }
        }
        return options;
    }

    renderConfigMain(): any {
        return (
            <div>
                <Form.Field >
                    <Form.Label size="small">Title</Form.Label>
                    <Form.Control>
                        <Form.Input size="small"
                            type="text"
                            value={"" + this.state.config.title}
                            onChange={this.updateTitle}
                        />
                    </Form.Control>
                </Form.Field>
            </div>
        );
    }

    renderConfigPanel = () => {
        return (
            <div>
                <Form.Label size="small">Panel:</Form.Label>
                {!this.state.config.title ? <p>Please provide a title.</p> :
                    <div>
                        <Form.Field>
                            <Form.Control>
                                {!this.state.config.panels.length ? undefined :
                                    <Form.Select size="small"
                                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                            this.setState({
                                                selectedPanel: Number.parseInt(event.currentTarget.value, 10),
                                                selectedItem: 0
                                            });
                                            console.log("selected panel", event.currentTarget.value);

                                        }}>
                                        {this.state.config
                                            .panels.map((p, i) => <option value={i} selected={i === this.state.selectedPanel}>{p.title}</option>)}
                                    </Form.Select>
                                }
                                <Button
                                    size="small"
                                    onClick={() => {
                                        this.state.config.panels.push({
                                            title: "Panel " + (this.state.config.panels.length + 1),
                                            entries: []
                                        });
                                        this.setState({ selectedPanel: this.state.config.panels.length - 1 });
                                    }}
                                ><Icon className="fa fa-plus" /></Button>
                            </Form.Control>
                        </Form.Field>

                        {!this.state.config.panels[this.state.selectedPanel] ? undefined :
                            <Form.Field>
                                <Form.Label size="small">Title:</Form.Label>
                                <Form.Control>
                                    <Form.Input
                                        size="small"
                                        type="text"
                                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                            this.state.config.panels[this.state.selectedPanel].title = event.currentTarget.value;
                                            this.redraw();
                                        }}
                                        value={this.state.config.panels[this.state.selectedPanel].title}
                                    />
                                </Form.Control>
                            </Form.Field>
                        }
                    </div>
                }
            </div>
        );
    }

    renderItemConfigDetail = (currentItem: ConfigEntry) => {
        return ([
            <Form.Field>
                <Form.Label size="small">Label:</Form.Label>
                <Form.Control>
                    <Form.Input
                        size="small"
                        type="text"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            currentItem.label = event.currentTarget.value;
                            this.redraw();
                        }}
                        value={currentItem.label}
                    />
                </Form.Control>
            </Form.Field>,
            <Form.Field>
                <Form.Label size="small">Type:</Form.Label>
                <Form.Control>
                    <Form.Select
                        size="small"
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                            console.log("selected type", event.currentTarget.value);
                            const newType = str2InputType(event.currentTarget.value);
                            this.state.config.panels[this.state.selectedPanel]
                                .entries[this.state.selectedItem].type = newType;
                            this.redraw();
                        }}>
                        {this.renderInputTypeItems(currentItem.type)}
                    </Form.Select>
                </Form.Control>
            </Form.Field>,
            <Form.Field>
                <Form.Label size="small">Help text:</Form.Label>
                <Form.Control>
                    <Form.Input
                        size="small"
                        type="text"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            currentItem.help = event.currentTarget.value;
                            this.redraw();
                        }} value={this.state.config.panels[this.state.selectedPanel]
                            .entries[this.state.selectedItem].help}
                    />
                </Form.Control>
            </Form.Field>
        ]);
    }
    renderConfigItem = (currentItem: ConfigEntry): any => {
        return (
            <div>
                <Form.Field>
                    <Form.Label size="small">Item:</Form.Label>
                    {this.state.config.panels.length === 0 ? <p>Please add a panel.</p> :
                        <Form.Control>
                            {!currentItem ? undefined :
                                <Form.Select size="small"
                                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                        this.setState({ selectedItem: Number.parseInt(event.currentTarget.value, 10) });
                                        console.log("selected item", event.currentTarget.value);

                                    }}>
                                    {this.state.config.panels[this.state.selectedPanel]
                                        .entries.map((e, i) => <option value={i} selected={i === this.state.selectedItem}>{e.label}</option>)}
                                </Form.Select>}
                            <Button
                                size="small"
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
                        </Form.Control>
                    }
                </Form.Field>
                {!currentItem ? undefined : this.renderItemConfigDetail(currentItem)}
            </div>
        );
    }

    renderMainTabs = () => {
        return (<Tabs>
            {[
                { lbl: "UI", tab: SelectedTab.PREVIEW, ico: "fa fa-eye" },
                { lbl: "config.json", tab: SelectedTab.CONFIG_JSON, ico: "fa fa-edit" },
                { lbl: "Config.cpp", tab: SelectedTab.CONFIG_CPP, ico: "fa fa-code" },
                { lbl: "Config.h", tab: SelectedTab.CONFIG_H, ico: "fa fa-code" },
                { lbl: "main.cpp", tab: SelectedTab.MAIN_CPP, ico: "fa fa-code" }
            ].map(e =>
                <Tabs.Tab active={this.state.selectedTab === e.tab} onClick={() => this.setState({ selectedTab: e.tab })}>
                    <Icon size="small"><span className={e.ico} /></Icon>
                    <span>{e.lbl}</span>
                </Tabs.Tab>)}
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
            <Form.Field>
                {/* <Form.Label></Form.Label> */}
                <Form.Control>
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
                </Form.Control>
            </Form.Field>
        );
    }

    renderCpp = () => {
        return (
            <Form.Field>
                <Form.Control>
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
                </Form.Control>
            </Form.Field>
        );
    }

    renderMainCpp = () => {
        return (
            <Form.Field>
                <Form.Control>
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
                </Form.Control>
            </Form.Field>
        );
    }

    renderH = () => {
        return (
            <Form.Field>
                <Form.Control>
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
                </Form.Control>
            </Form.Field>
        );
    }

    onPreviewSave = () => {
        const data = getDataFromConfig(this.state.config);
        console.log(data);
        toastr.success("Saved.", "This was just simulated.");
    }

    render() {
        const currentItem = this.state.config.panels[this.state.selectedPanel]
            && this.state.config.panels[this.state.selectedPanel].entries[this.state.selectedItem];
        return (
            <div>
                <ConfigGenNavbar config={this.state.config} onNavSelect={(config: Config) => this.setState({ config })} />
                <Container>
                    <Columns>
                        <Columns.Column size={2}>
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
                        </Columns.Column>
                        <Columns.Column size={10}>
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
                        </Columns.Column>
                    </Columns>
                </Container>
            </div >
        );
    }

}
