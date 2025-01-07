import { observer } from "mobx-react-lite";
import { Button, Grid, Header} from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

function PhotoUploadWidget() {

    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => console.log(blob));
        }
    }

    useEffect(()=>{
        return () => {
            files.forEach((file : object & {preview? : string}) => URL.revokeObjectURL(file.preview!));
        }
    },[files]);

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Add Photo' />
                <PhotoWidgetDropzone setFiles = {setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Resize image' />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview}/>
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 3 - Preview & upload' />

                {files && files.length > 0 &&
                <>
                    <div className="img-preview" style={{minHeight: 200, overflow:'hidden'}} />
                    <Button.Group>
                        <Button onClick={onCrop} positive icon='check' />
                        <Button onClick={()=> setFiles([])} positive icon='close' />
                    </Button.Group>
                </>
                }
            </Grid.Column>
        </Grid>
    )
}

export default observer(PhotoUploadWidget);