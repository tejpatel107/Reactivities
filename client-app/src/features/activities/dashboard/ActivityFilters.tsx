import { observer } from "mobx-react-lite";
import React from "react";
import Calendar from "react-calendar";
import { Header, Menu, MenuItem } from "semantic-ui-react";

function ActivityFilters() {
    return (
        <>
            <Menu vertical size="large" style={{width:'100%', marginTop: 27}}>
                <Header icon='filter' attached color="teal" content="Filters" />
                <MenuItem content="All Activities"/>
                <MenuItem content="I'm going"/>
                <MenuItem content="I'm hosting" />
            </Menu>
            <Header />
            <Calendar />
        </>
    )
}

export default observer(ActivityFilters);