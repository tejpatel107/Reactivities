import { observer } from 'mobx-react-lite';
import { Fragment } from 'react/jsx-runtime';
import { Segment, Button, Placeholder } from 'semantic-ui-react';

function ActivityListItemPlaceholder() {
    return (
        <Fragment>
            <Placeholder fluid style={{ marginTop: 25 }}>
                <Segment.Group>
                    <Segment style={{ minHeight: 110 }}>
                        <Placeholder>
                            <Placeholder.Header image>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                    <Segment>
                        <Placeholder>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder>
                    </Segment>
                    <Segment secondary style={{ minHeight: 70 }} />
                    <Segment clearing>
                        <Button disabled color='blue' floated='right' content='View' />
                    </Segment>
                </Segment.Group>
            </Placeholder>
        </Fragment>
    );
}

export default observer(ActivityListItemPlaceholder);
