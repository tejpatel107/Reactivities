import { Button, Container, Menu, Image, Dropdown } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../stores/store";

function NavBar() {

    const { userStore: { user, logout } } = useStore();

    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item header as={NavLink} to="/">
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }} />
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to="/activities" name="Activities"  />
                <Menu.Item >
                    <Button positive as={NavLink} to="/createActivity" content='Create Activity' />
                </Menu.Item>
                <Menu.Item position="right">
                    <Image src={user?.image || '/assets/user.png'} avatar spaced='right' />
                    <Dropdown pointing="top right" text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as={Link}
                                to={`/profiles/${user?.userName}`}
                                text="My Profile"
                                icon="user" />
                            <Dropdown.Item
                                onClick={logout}
                                text="Logout"
                                icon="power" />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default observer(NavBar);