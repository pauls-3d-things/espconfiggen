import * as React from "react";
import {
    Container, Section, Title, Field, Control, Input, Checkbox, Column, Columns, Card,
    CardHeader, CardHeaderTitle, CardContent, Content, Button, Label, Help
} from "bloomer";
import { Config, ConfigPanel, ConfigEntry, InputType } from "./ConfigApi";

export type OnEntryChange = (entry: ConfigEntry, event: React.FormEvent<HTMLInputElement>) => void;

export const applyEventToEntry = (entry: any, event: React.FormEvent<HTMLInputElement>) => {
    switch (entry.type) {
        case InputType.STRING:
        case InputType.NUMBER:
            entry.value = event.currentTarget.value;
            break;
        case InputType.CHECKBOX:
            entry.value = !entry.value;
            break;
    }
};

export const renderEntryInput = (entry: ConfigEntry, onEntryChange: OnEntryChange) => {
    switch (entry.type) {
        case InputType.STRING:
            return (
                <div key={entry.label + "div"} >
                    <Label key={entry.label + "key"}> {entry.label} </Label>
                    < Control key={entry.label + "ctrl"} >
                        <Input
                            type="text"
                            value={"" + entry.value}
                            onChange={(event: React.FormEvent<HTMLInputElement>) => onEntryChange(entry, event)}
                        />
                        {
                            entry.help && <Help>{entry.help} </Help>}
                    </Control>
                </div>
            );
        case InputType.NUMBER:
            return (
                <div key={entry.label + "div"} >
                    <Label>{entry.label} </Label>
                    < Control key={entry.label + "ctrl"} >
                        <Input
                            type="number"
                            value={typeof (entry.value) === "number" ? entry.value : Number.parseInt("" + entry.value)
                            }
                            onChange={(event: React.FormEvent<HTMLInputElement>) => onEntryChange(entry, event)}
                        />
                        {
                            entry.help && <Help>{entry.help} </Help>}
                    </Control>
                </div>
            );
        case InputType.CHECKBOX:
            return (<Control>
                <Label>{entry.label} </Label>
                <Checkbox
                    checked={entry.value === true}
                    onChange={(event: React.FormEvent<HTMLInputElement>) => onEntryChange(entry, event)}
                > {entry.help} </Checkbox>
            </Control>
            );
        default:
            return "Unknown Type: " + entry.type;
    }

};
export const renderEntry = (entry: ConfigEntry, onEntryChange: OnEntryChange) => {
    return <Field key={entry.label + "field"}>
        {renderEntryInput(entry, onEntryChange)}
    </Field>;
};

export const renderPanel = (panel: ConfigPanel, onEntryChange: OnEntryChange) => {
    return <Card key={panel.title + "panel"}>
        <CardHeader>
            <CardHeaderTitle>
                {panel.title}
            </CardHeaderTitle>
            {/* < CardHeaderIcon >
                <Icon className="fa fa-angle-down" />
            </CardHeaderIcon> */}
        </CardHeader>
        < CardContent >
            <Content>
                {panel.entries.map(entry => renderEntry(entry, onEntryChange))}
            </Content>
        </CardContent>
    </ Card>;
};

export const renderConfigPage = (config: Config, onEntryChange: OnEntryChange, saveEnabled: boolean, onSave: () => void) => {
    return (
        <Section>
            <Container>
                <Title>{config.title || ""} </Title>
                <div>
                    {config.panels
                        .map((panel: ConfigPanel) => renderPanel(panel, onEntryChange))
                        .reduce((rows: any[][], panel: JSX.Element, i: number) => {
                            const chunk = Math.floor(i / 3);
                            rows[chunk] = rows[chunk] || [];
                            rows[chunk].push(<Column isSize="1/3" key={"p" + i} > {panel} </Column>);
                            return rows;
                        }, [])
                        .map((chunk: JSX.Element[], i) => <Columns key={"col" + i}>{chunk} </Columns>)
                    }
                    {!(config.panels[0] && config.panels[0].entries.length) ? undefined :
                        < Field isGrouped>
                            <Control>
                                <Button isColor="primary" disabled={!saveEnabled} onClick={onSave}>Save</Button>
                            </Control>
                        </Field>
                    }
                </div>

            </Container>
        </Section >
    );
};
