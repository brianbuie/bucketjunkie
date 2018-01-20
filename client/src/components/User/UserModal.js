import React from 'react';
import { Modal, ModalHeader, ModalBody, FormGroup, Button } from 'reactstrap';
import A from 'components/Utilities/A';
import UserPhoto from 'components/User/UserPhoto';
import UserPhotoForm from 'components/User/UserPhotoForm';

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
        {submitNewPhoto ? (
          <UserPhotoForm 
            photo={photo} 
            className="mx-auto my-4" 
            style={{ width: '200px' }} 
            submit={data => { submitNewPhoto(data); toggle(); }}
            cancel={toggle}
          />
        ) : (
          <div className="mx-auto my-4" style={{ width: '200px' }}>
            <UserPhoto photo={photo} />
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}

export default UserModal;