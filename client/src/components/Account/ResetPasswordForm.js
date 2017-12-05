import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { submitPasswordReset, validatePasswordResetToken } from 'actions';
import { A } from 'components/Utilities';

class ResetPasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      'confirm-password': '',
      token: props.token
    }
    this.fieldChange = this.fieldChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  fieldChange(e) {
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  submitForm(e) {
    e.preventDefault();
    this.props.submitPasswordReset({...this.state});
  }

  render() {
    return (
      <Scrollbars autoHide>
        <div className="bg-light p-3 height-100">
          <h2 className="text-center">
            Reset Password
          </h2>
          <form onSubmit={e => this.submitForm(e)}>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" name="password" value={this.state.password} onChange={this.fieldChange} />
            </FormGroup>
            <FormGroup>
              <Label for="confirm-password">Again</Label>
              <Input type="password" name="confirm-password" value={this.state["confirm-password"]} onChange={this.fieldChange} />
            </FormGroup>
            <Button type="submit" color="success" className="my-3" block>
               Reset →
            </Button>
          </form>
        </div>
      </Scrollbars>
    );
  }
};

const mapStateToProps = ({ router }) => ({
  token: queryString.parse(router.location.search)['password-reset']
})

const mapDispatchToProps = dispatch => ({
  submitPasswordReset: data => dispatch(submitPasswordReset(data)),
  validatePasswordResetToken: token => dispatch(validatePasswordResetToken(token)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordForm);