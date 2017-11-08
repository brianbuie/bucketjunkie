import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addActivityItem } from '../../actions';


const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (e) => {
    e.preventDefault();
    dispatch(addActivityItem({
      _id: 'test-id',
      category: 'chat',
      user: { username: 'Test' },
      date: '2017-11-08 Test O\'clock',
      message: 'temporary message'
    }));
  }
});

class ChatFormComponent extends React.Component {
  render() { 
    return(
      <form onSubmit={ this.props.onSubmit }>
        <div className="form-group my-0 pr-0">
          <input ref={el => this.chatInput = el} className="form-control" type="text" name="message" placeholder="Chat" autoComplete="off" />
        </div>
      </form>
    );
  }
}

const ChatForm = connect(null, mapDispatchToProps)(ChatFormComponent);


export default ChatForm;