import { ConfigPanel } from "../ConfigApi";
import * as React from "react";
import { renderEntry } from "./ConfigEntry";
import { Card, Content } from "react-bulma-components";

export const renderPanel = (panel: ConfigPanel, onEntryChanged: () => void, isInGeneratorApp: boolean) => {
    return <Card key={panel.title + "panel"}>
        <Card.Header>
            <Card.Header.Title>
                {panel.title}
            </Card.Header.Title>
            {/* < CardHeaderIcon >
                <Icon className="fa fa-angle-down" />
            </CardHeaderIcon> */}
        </Card.Header>
        <Card.Content>
            <Content>
                {panel.entries.map(entry => renderEntry(entry, onEntryChanged, isInGeneratorApp))}
            </Content>
        </Card.Content>
    </ Card>;
};
