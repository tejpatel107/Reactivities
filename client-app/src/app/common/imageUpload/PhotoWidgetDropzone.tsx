import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react';

interface Props {
  setFiles: (files: object[]) => void;
}

function PhotoWidgetDropzone({ setFiles }: Props) {

  const dzStyles = {
    border: '3px dashed #eee',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center' as const,
    height: 200
  }

  const dzActive = {
    borderColor: 'green',
  }

  const onDrop = useCallback((acceptedFiles: object[]) => {
    // Do something with the files
    setFiles(acceptedFiles.map((file: object) => Object.assign(file, {
      preview: URL.createObjectURL(file as Blob)
    })))
  }, [setFiles])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}>
      <input {...getInputProps()} />
      <Icon name='upload' size='huge' />
      <Header content='Drop image here' />
    </div>
  )
}

export default observer(PhotoWidgetDropzone);