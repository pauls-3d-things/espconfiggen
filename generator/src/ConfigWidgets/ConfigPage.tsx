import * as React from "react";
import { Config, ConfigPanel } from "../ConfigApi";
import { renderPanel } from "./ConfigPanel";
import { Section, Container, Heading, Columns, Button, Form } from "react-bulma-components";

export const renderConfigPage = (config: Config,
    onEntryChanged: () => void,
    saveEnabled: boolean,
    onSave: () => void,
    isInGeneratorApp: boolean) => {
    return (
        <Section>
            <Container>
                <Heading>{config.title || ""} </Heading>
                <div>
                    {config.panels
                        .map((panel: ConfigPanel) => renderPanel(panel, onEntryChanged, isInGeneratorApp))
                        .reduce((rows: any[][], panel: JSX.Element, i: number) => {
                            const chunk = Math.floor(i / 3);
                            rows[chunk] = rows[chunk] || [];
                            rows[chunk].push(<Columns.Column size="one-third" key={"p" + i} > {panel} </Columns.Column>);
                            return rows;
                        }, [])
                        .map((chunk: JSX.Element[], i) => <Columns key={"col" + i}>{chunk} </Columns>)
                    }
                    {!(config.panels[0] && config.panels[0].entries.length) ? undefined :
                        <Form.Field>
                            <Form.Control>
                                <Button color="primary" disabled={!saveEnabled} onClick={onSave}>Save</Button>
                            </Form.Control>
                        </Form.Field>
                    }
                </div>

            </Container>
        </Section >
    );
};
