import { observer } from "mobx-react-lite";
import { Button, Grid, Header} from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
    loading : boolean;
    uploadPhoto: (file : Blob) => void 
}

function PhotoUploadWidget({loading, uploadPhoto} : Props) {

    const [files, setFiles] = useState<object & { preview?: string }[]>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
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
                    <div className="img-preview" style={{minHeight: 200, overflow:'hidden', marginBottom:10}} />
                    <Button.Group widths={2}>
                        <Button loading={loading} onClick={onCrop} positive icon='check' />
                        <Button disabled={loading} onClick={()=> setFiles([])} icon='close' />
                    </Button.Group>
                </>
                }
            </Grid.Column>
        </Grid>
    )
}

export default observer(PhotoUploadWidget);