import * as React from "react";
import { Config, ConfigPanel } from "../ConfigApi";
import { renderPanel } from "./ConfigPanel";
import { Section } from "bloomer/lib/layout/Section";
import { Container } from "bloomer/lib/layout/Container";
import { Title } from "bloomer/lib/elements/Title";
import { Column } from "bloomer/lib/grid/Column";
import { Columns } from "bloomer/lib/grid/Columns";
import { Field } from "bloomer/lib/elements/Form/Field/Field";
import { Control } from "bloomer/lib/elements/Form/Control";
import { Button } from "bloomer/lib/elements/Button";

export const renderConfigPage = (config: Config,
    onEntryChanged: () => void,
    saveEnabled: boolean,
    onSave: () => void,
    isInGeneratorApp: boolean) => {
    return (
        <Section>
            <Container>
                <Title>{config.title || ""} </Title>
                <div>
                    {config.panels
                        .map((panel: ConfigPanel) => renderPanel(panel, onEntryChanged, isInGeneratorApp))
                        .reduce((rows: any[][], panel: JSX.Element, i: number) => {
                            const chunk = Math.floor(i / 3);
                            rows[chunk] = rows[chunk] || [];
                            rows[chunk].push(<Column isSize="1/3" key={"p" + i} > {panel} </Column>);
                            return rows;
                        }, [])
                        .map((chunk: JSX.Element[], i) => <Columns key={"col" + i}>{chunk} </Columns>)
                    }
                    {!(config.panels[0] && config.panels[0].entries.length) ? undefined :
                        <Field isGrouped>
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
