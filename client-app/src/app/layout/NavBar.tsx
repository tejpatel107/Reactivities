import { Button, Container, Menu } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";

function NavBar() {
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item header as={NavLink} to="/">
                    <img src="/assets/logo.png" alt="logo" style={{marginRight : 10}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to="/activities" name="Activities" />
                <Menu.Item as={NavLink} to="/errors" name="Errors" />
                <Menu.Item >
                    <Button positive as={NavLink} to="/createActivity" content='Create Activity' />
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default observer(NavBar);