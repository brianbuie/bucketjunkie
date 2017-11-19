import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { submitNewPhoto } from '../../actions';

const AccountPage = ({ user, submitNewPhoto }) => {
  let form;
  return (
    <div>
      <h2 className="text-center">
        {user.username}
      </h2>
      <div className="text-center p-3">
        <img 
          className="rounded-circle" 
          style={{ width: '100px' }} 
          src={user.photo ? `/images/uploads/${user.photo}` : '/images/user-default.png'} 
        />
      </div>
      <form 
        encType="multipart/form-data"
        onSubmit={(e) => {
          e.preventDefault();
          let formData = new FormData(form);
          console.log(form);
          console.log(formData);
          submitNewPhoto(formData);
        }}
        ref={el => (form = el)}
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

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  submitNewPhoto: photo => dispatch(submitNewPhoto(photo))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountPage);