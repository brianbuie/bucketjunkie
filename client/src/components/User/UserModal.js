import React from 'react';
import { Modal, ModalHeader, ModalBody, FormGroup, Button, Label } from 'reactstrap';
import A from 'components/Utilities/A';
import UserPhoto from 'components/User/UserPhoto';

const UserModal = ({ username, photo, toggle, isOpen, submitNewPhoto, logout }) => {
  let form;
  return (
    <Modal isOpen={isOpen} toggle={toggle} contentClassName="bg-body-light">
      <ModalBody>
        <div className="flex-row justify-content-end">
          <Button className="close" onClick={toggle}>
            &times;
          </Button>
        </div>
        <h1 className="text-center">
          {username}
        </h1>
        {logout && <p className="text-center">
          <A className="text-danger" click={() => { logout(); toggle(); }}>
            Logout
          </A>
        </p>}
        <div className="mx-auto p-3" style={{ width: '150px' }}>
          <UserPhoto photo={photo} />
        </div>
        {submitNewPhoto && <form 
          encType="multipart/form-data"
          onSubmit={e => { e.preventDefault(); submitNewPhoto(new FormData(form)); toggle(); }}
          ref={el => form = el}
        >
          <FormGroup className="text-center">
            <input type="file" name="photo" accept="image/png, image/jpeg" />
          </FormGroup>
          <Button type="submit" color="primary" block outline>
             Save →
          </Button>
        </form>}
      </ModalBody>
    </Modal>
  );
}

export default UserModal;