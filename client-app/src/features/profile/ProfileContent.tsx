import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "../../app/models/Profile";
import ProfileFollowings from "./ProfileFollowings";
import { useStore } from "../../app/stores/store";

interface Props {
    profile: Profile;
}

function ProfileContent({ profile } : Props) {

    const { profileStore } = useStore();
    const { setActiveTab } = profileStore;
    
    const panes = [
        { menuItem: 'About', render: () => <Tab.Pane>About Content</Tab.Pane> },
        { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile}/> },
        { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
        { menuItem: 'Followers', render: () => <ProfileFollowings /> },
        { menuItem: 'Following', render: () => <ProfileFollowings /> }
    ];

    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
            onTabChange={(_,data) => setActiveTab(data.activeIndex as number) }
        />
    )
}

export default observer(ProfileContent);