import { observer } from "mobx-react-lite";
import { Card, Header, Tab, Image, Grid, Button } from "semantic-ui-react";
import { IPhoto, Profile } from "../../app/models/Profile";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent, useState } from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface Props {
    profile: Profile;
}

function ProfilePhotos({ profile, }: Props) {

    const { profileStore: { isCurrentUser, uploadPhoto, uploading,
        loading, setMainPhoto, deletePhoto } } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('');

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => { setAddPhotoMode(false) });
    }

    function handleSetMainPhoto(photo: IPhoto, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: IPhoto, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos' />
                    {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content={addPhotoMode ? 'Cancel' : 'Add photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ?
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
                        : <Card.Group itemsPerRow={5}>
                            {profile.photos?.map(photo => {
                                return (
                                    <Card>
                                        <Image src={photo.url || '/assets/user.png'} />
                                        {isCurrentUser && (
                                            <Button.Group>
                                                <Button
                                                    basic
                                                    color='green'
                                                    content='Main'
                                                    name={'main' + photo.id}
                                                    disabled={photo.isMain}
                                                    loading={target === 'main' + photo.id && loading}
                                                    onClick={e => handleSetMainPhoto(photo, e)}
                                                />
                                                <Button
                                                    basic
                                                    icon='trash'
                                                    color='red'
                                                    loading={target === photo.id && loading}
                                                    onClick={e => handleDeletePhoto(photo, e)}
                                                    disabled={photo.isMain}
                                                    name={photo.id}
                                                />
                                            </Button.Group>
                                        )}
                                    </Card>
                                )
                            })}
                        </Card.Group>}
                </Grid.Column>
            </Grid>

        </Tab.Pane>
    )
}

export default observer(ProfilePhotos);