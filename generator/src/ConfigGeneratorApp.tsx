import * as React from "react";
import { Config, ConfigEntry, InputType, str2InputType } from "./ConfigApi";
import { applyEventToEntry, renderConfigPage } from "./ConfigWidgets";
import { Title, Label, Input, Control, Field, Select, Columns, Column, Button, Icon, Container } from "bloomer";
import { saveAs } from "file-saver";

interface ConifgGeneratorAppState {
    config: Config;
    lastChange: number;
    selectedPanel: number;
    selectedItem: number;
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
            selectedItem: 0
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

    renderConfigConfig(): any {
        return (<Column isSize="1/3" >
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
            {!this.state.config.panels.length ? undefined :
                <Field isGrouped>
                    <Control>
                        <Button isColor="primary" onClick={() => {
                            const blob = new Blob([JSON.stringify(this.state.config)], { type: "text/plain;charset=utf-8" });
                            saveAs(blob, "config.json");
                        }} >
                            Generate Code
                    </Button>
                    </Control>
                </Field>
            }
        </Column>);
    }

    renderPanelConfig = () => {
        return (
            <Column isSize="1/3">
                <Label isSize="small">Panel:</Label>
                {!this.state.config.title ? <p>Please add a title.</p> :
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
            </Column>
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
    renderItemConfig = (currentItem: ConfigEntry): any => {
        return (<Column isSize="1/3">
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
                                        type: InputType.NUMBER,
                                        value: ""
                                    });
                                this.setState({ selectedItem: this.state.config.panels[this.state.selectedPanel].entries.length - 1 });
                            }}
                        ><Icon icon="plus" /></Button>
                    </Control>
                }
            </Field>
            {!currentItem ? undefined : this.renderItemConfigDetail(currentItem)}
        </Column>);
    }

    render() {
        const currentItem = this.state.config.panels[this.state.selectedPanel]
            && this.state.config.panels[this.state.selectedPanel].entries[this.state.selectedItem];
        return <div>
            <Container>
                <Title isSize={3}>ESP8266 Config Server Generator</Title>

                <Columns>
                    {this.renderConfigConfig()}
                    {this.renderPanelConfig()}
                    {this.renderItemConfig(currentItem)}
                </Columns>
            </Container>
            <hr />
            {renderConfigPage(this.state.config, this.onEntryChange)}
        </div >;
    }

    onEntryChange = (entry: ConfigEntry, event: React.FormEvent<HTMLInputElement>) => {
        applyEventToEntry(entry, event);
        this.redraw();
    }

}