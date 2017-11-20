import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { submitNewPhoto } from '../../actions';

class AccountPage extends React.Component {
  submitForm(e) {
    e.preventDefault();
    let formData = new FormData(this.form);
    this.props.submitNewPhoto(formData);
  }

  render() {
    return (
      <div>
        <h2 className="text-center">
          {this.props.user.username}
        </h2>
        <div className="text-center p-3">
          <img 
            className="rounded-circle" 
            style={{ width: '100px' }} 
            src={this.props.user.photo 
              ? `/images/uploads/${this.props.user.photo}` 
              : '/images/user-default.png'
            } 
          />
        </div>
        <form 
          encType="multipart/form-data"
          onSubmit={(e) => this.submitForm(e)}
          ref={el => (this.form = el)}
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
  }
}

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