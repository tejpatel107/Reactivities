import { observer } from "mobx-react-lite";
import { Button, Grid, Header, Item, ItemContent, Tab, TextArea } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Profile } from "../../app/models/Profile";
import { useState } from "react";

interface Props {
    profile: Profile;
}

function ProfileAbout({ profile }: Props) {

    const { profileStore: { isCurrentUser, editBio } } = useStore();

    const [openBioTextBox, setOpenBioTextBox] = useState(false);
    const [savedBioText, setSavedBioText] = useState(profile.bio);
    const [bioText, setBioText] = useState(savedBioText);
    const [originalBioText,setOriginalBioText] = useState(profile.bio);

    function handleOnClickSaveButton() {
        console.log(bioText);
        setOriginalBioText(bioText);
        setSavedBioText(bioText);
        editBio(profile.username, bioText!);
        setOpenBioTextBox(false);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{ marginBottom: '-10px' }}>
                    <Header floated='left' icon='image' content='Bio' />
                    {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content='Edit Bio'
                            onClick={() => setOpenBioTextBox(true)}
                        />
                    )}
                </Grid.Column>
                {openBioTextBox ? (
                    <Grid.Column width={16} >
                        <TextArea
                            style={{
                                width: '100%',
                                minHeight: '150px', // Set a reasonable minimum height
                                maxHeight: '250px', // Limit max height
                                resize: 'vertical', // Allow only vertical resizing
                                overflowY: 'auto', // Enable scrolling if needed
                            }}
                            placeholder="Enter Bio ..."
                            value={bioText}
                            onChange={(e) => setBioText(e.target.value)} // Updates state on change
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <Button
                                content='Close'
                                onClick={() => setOpenBioTextBox(false)}
                            />
                            <Button
                                content='Save'
                                color='green'
                                onClick={() => {
                                    handleOnClickSaveButton()
                                }}
                                disabled={bioText === originalBioText}
                            />
                        </div>
                    </Grid.Column>
                ) : (
                    <>
                        <Grid.Column width={16} >
                            <Item>
                                <ItemContent
                                    as='p'
                                    style={{
                                        textAlign: 'justify',
                                        paddingRight: '10px',
                                        paddingLeft: '10px',
                                        whiteSpace: 'pre-line'
                                    }}
                                    content={bioText}
                                />
                            </Item>
                        </Grid.Column>
                    </>
                )}
            </Grid>
        </Tab.Pane >
    )
}

export default observer(ProfileAbout);