import { Profile } from "../../app/models/Profile";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import FollowButton from "./FollowButton";

interface Props {
    profile: Profile
}

function ProfileCard({ profile }: Props) {
    return (
        <Card as={Link}
            to={`/profiles/${profile.username}`}
        >
            <Image src={profile.image || `/assets/user.png`} />
            <Card.Content>
                <Card.Header>
                    {profile.displayName}
                </Card.Header>
                <Card.Description>
                    Bio goes here
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                {profile.followersCount}
            </Card.Content>
            <FollowButton profile={profile} />
        </Card>
    )
}

export default observer(ProfileCard);