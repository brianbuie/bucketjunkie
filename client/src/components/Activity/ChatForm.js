import React from 'react';
import { connect } from 'react-redux';
import { sendChat } from 'actions';

const ChatForm = ({ submit }) => {
  let input;
  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!input.value.trim()) return;
      submit(input.value);
      input.value = '';
    }}>
      <div className="form-group my-0 pr-0">
        <input ref={el => input = el} className="form-control Chat__Form" type="text" name="message" placeholder="Chat" autoComplete="off" />
      </div>
    </form>
  );
};

const mapDispatchToProps = dispatch => ({
  submit: input => dispatch(sendChat(input)),
});

export default connect(
  null,
  mapDispatchToProps
)(ChatForm);