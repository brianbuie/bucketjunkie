import React from 'react';
import { Modal, ModalHeader, ModalBody, FormGroup, Button, Label } from 'reactstrap';
import { A } from 'components/Utilities';
import UserPhoto from 'components/User/UserPhoto';

const AccountModal = ({
  user,
  toggle,
  isOpen,
  submitNewPhoto,
  logout
}) => {
  let form;
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        Account
      </ModalHeader>
      <ModalBody>
        <h2 className="text-center">
          {user.username}
        </h2>
        <p className="text-center">
          <A className="text-danger" click={logout}>
            Logout
          </A>
        </p>
        <div className="mx-auto p-3" style={{ width: '150px' }}>
          <UserPhoto photo={user.photo} />
        </div>
        <form 
          encType="multipart/form-data"
          onSubmit={e => { e.preventDefault(); submitNewPhoto(new FormData(form)); toggle(); }}
          ref={el => form = el}
        >
          <FormGroup className="text-center">
            <input type="file" name="photo" accept="image/gif, image/png, image/jpeg" />
          </FormGroup>
          <Button type="submit" color="success" block>
             Save →
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
}

export default AccountModal;