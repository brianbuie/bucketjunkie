import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { submitNewPhoto } from 'actions';
import UserPhoto from 'components/User/UserPhoto';

const AccountPage = ({ user, submitNewPhoto }) => {
  let form;
  return (
    <div>
      <h2 className="text-center">
        {user.username}
      </h2>
      <div className="mx-auto p-3" style={{ width: '150px' }}>
        <UserPhoto photo={user.photo} />
      </div>
      <form 
        encType="multipart/form-data"
        onSubmit={(e) => {
          e.preventDefault();
          submitNewPhoto(new FormData(form));
        }}
        ref={el => form = el}
      >
        <FormGroup>
          <Label for="photo">New Picture</Label>
          <input type="file" name="photo" accept="image/gif, image/png, image/jpeg" />
        </FormGroup>
        <Button type="submit" color="success" block>
           Save →
        </Button>
      </form>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = dispatch => ({
  submitNewPhoto: photo => dispatch(submitNewPhoto(photo))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountPage);