import React from 'react';
import { connect } from 'react-redux';
import { submitNewPhoto, submitLogout } from 'actions';
import UserPhoto from 'components/User/UserPhoto';
import AccountModal from 'components/Account/AccountModal';
import { A } from 'components/Utilities';

class AccountLauncher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const user = this.props.user;
    return (
      <div>
        <div style={{ width: '30px' }}>
          <A click={this.toggle}>
            <UserPhoto photo={user.photo} />
          </A>
        </div>
        <AccountModal 
          user={user} 
          toggle={this.toggle} 
          isOpen={this.state.isOpen} 
          submitNewPhoto={this.props.submitNewPhoto}
          logout={this.props.logout} 
        />
      </div>
    );
  }
};

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = dispatch => ({
  submitNewPhoto: photo => dispatch(submitNewPhoto(photo)),
  logout: () => dispatch(submitLogout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountLauncher);