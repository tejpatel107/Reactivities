import { Container, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store"
import { observer } from "mobx-react-lite"

export default observer (function ServerError() {
    
    const {commonStore} = useStore();

    return (
        <Container>
            <Header as='h1' content='Sub Header' />
            <Header as='h5' content={commonStore.error?.message}  color="red"/>
            {commonStore.error?.details && (
                <Segment>
                    <Header as='h4' content='Stack trace' color="teal" />
                    <code style={{marginTop:'10px'}}>
                        {commonStore.error.details}
                    </code>
                </Segment>
            )}
        </Container>
    )
})