import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import { CardGroup, Grid, Header, Tab } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";
import { Profile } from "../../app/models/Profile";

function ProfileFollowings() {

    const { profileStore } = useStore();
    const { profile, loadingFollowings, followings, activeTab } = profileStore;

    return (
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width={16}>
                    <Header 
                        floated='left' 
                        icon='user' 
                        content={activeTab === 3 ? `People following ${profile?.username}`: `People ${profile?.displayName} is following`} />
                </Grid.Column>
                <Grid.Column width={16} >
                    <CardGroup>
                        {followings.map((profile: Profile) => (
                            <ProfileCard key={profile.username} profile={profile} />
                        ))}
                    </CardGroup>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfileFollowings);