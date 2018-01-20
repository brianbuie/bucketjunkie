import React from 'react';
import { FormGroup, Button, Label } from 'reactstrap';
import A from 'components/Utilities/A';
import { ImageRound } from 'components/UI';

class UserPhotoForm extends React.Component {
  componentWillMount = () => {
    const initialPhoto = this.props.photo ? `/images/uploads/${this.props.photo}` : '/images/player-default.png';
    this.setState({
      photo: initialPhoto,
      changed: false
    });
  }

  handleFile = () => {
    const file = this.refs.file.files[0];
    const reader = new FileReader();
    const url = reader.readAsDataURL(file);
    reader.onloadend = e => {
      this.setState({ 
        photo: reader.result,
        changed: true
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.submit(new FormData(this.refs.form));
  }

  render = () => (
    <div>
      <div className={`${this.props.className || ''} position-relative`} style={this.props.style || {}}>
        <ImageRound path={this.state.photo} />
        <label htmlFor="photo" className="UserPhotoForm__FileButton">
          <i className="fa fa-camera-retro" />
        </label>
      </div>
      <form encType="multipart/form-data" ref="form" onSubmit={this.handleSubmit}>
        <FormGroup className="text-center d-none">
          <input id="photo" ref="file" type="file" name="photo" accept="image/png, image/jpeg" onChange={this.handleFile} />
        </FormGroup>
        {this.state.changed && (
          <div className="flex-row justify-content-center">
            <Button color="secondary" className="mr-3 flex-grow" outline onClick={this.props.cancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-grow" color="success">
              Save →
            </Button>
          </div>
        )}
      </form>
    </div>
  )

}

export default UserPhotoForm;