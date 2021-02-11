import { useState } from 'react'
import { Modal, Input, Button, Icon } from 'semantic-ui-react'
import mime from 'mime-types'

const ImageUpload = (props) => {

    const [fileState, setFileState] = useState(null)
    const acceptedTypes = ['image/png','image/jpeg', 'image/jpg']
    
    const onFileAdded = event => {
        const file = event.target.files[0]
        if(file) {
            setFileState(file)
        }
    } 

    const onSubmit = () => {
        if(fileState && acceptedTypes.includes(mime.lookup(fileState.name))) {
            props.uploadImage(fileState, mime.lookup(fileState.name))
            props.onClose()
            setFileState(null)
        }
    }

    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Modal.Header>Select an image</Modal.Header>
                <Modal.Content>
                <Input 
                    type="file"
                    name="file"
                    onChange={onFileAdded}
                    fluid
                    label="File Type (png, jpeg, jpg)"
                />
            </Modal.Content>
            <Modal.Actions>
                <Button color='green' onClick={onSubmit} >
                    <Icon name='checkmark' />Add
                </Button>
                <Button color='red' onClick={props.onClose} >
                    <Icon name='remove' />Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default ImageUpload