import { ConfigPanel } from "../ConfigApi";
import * as React from "react";
import { Card } from "bloomer/lib/components/Card/Card";
import { CardHeader } from "bloomer/lib/components/Card/Header/CardHeader";
import { CardHeaderTitle } from "bloomer/lib/components/Card/Header/CardHeaderTitle";
import { CardContent } from "bloomer/lib/components/Card/CardContent";
import { Content } from "bloomer/lib/elements/Content";
import { renderEntry } from "./ConfigEntry";

export const renderPanel = (panel: ConfigPanel, onEntryChanged: () => void) => {
    return <Card key={panel.title + "panel"}>
        <CardHeader>
            <CardHeaderTitle>
                {panel.title}
            </CardHeaderTitle>
            {/* < CardHeaderIcon >
                <Icon className="fa fa-angle-down" />
            </CardHeaderIcon> */}
        </CardHeader>
        <CardContent>
            <Content>
                {panel.entries.map(entry => renderEntry(entry, onEntryChanged))}
            </Content>
        </CardContent>
    </ Card>;
};
