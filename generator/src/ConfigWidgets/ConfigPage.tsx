import * as React from "react";
import { Config, ConfigPanel } from "../ConfigApi";
import { renderPanel } from "./ConfigPanel";
import { Section } from "trunx/component/Section"
import { Container } from "trunx/component/Container"
import { Heading } from "trunx/component/Heading"
import { Columns } from "trunx/component/Columns"
import { Column } from "trunx/component/Column"
import { Button } from "trunx/component/Button"
import { Field } from "trunx/component/Field"
import { Control } from "trunx/component/Control"
import { Message } from "trunx/component/Message"

export const renderConfigPage = (config: Config,
    onEntryChanged: () => void,
    saveEnabled: boolean,
    onSave: () => void,
    isInGeneratorApp: boolean, info?: string) => {
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
                            rows[chunk].push(<Column isOneThird key={"p" + i} > {panel} </Column>);
                            return rows;
                        }, [])
                        .map((chunk: JSX.Element[], i) => <Columns key={"col" + i}>{chunk} </Columns>)
                    }
                    {!(config.panels[0] && config.panels[0].entries.length) ? undefined :
                        <Field>
                            <Control>
                                <Button color="primary" disabled={!saveEnabled} onClick={onSave}>Save</Button>
                            </Control>
                        </Field>
                    }
                </div>
            </Container>

            {info ?
                <Message style={{
                    right: "12px", top: "42px", position: "fixed"
                }}>
                    <Message.Body>
                        {info}
                    </Message.Body>
                </Message>
                : undefined
            }
        </Section >
    );
};
