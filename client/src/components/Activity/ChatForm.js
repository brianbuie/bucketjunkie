import React from 'react';
import { connect } from 'react-redux';
import { addActivityItem } from '../../actions';

const ChatForm = ({ dispatch }) => {
  let input;
  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!input.value.trim()) return;
      dispatch(addActivityItem({
        _id: 'test-id',
        category: 'chat',
        user: { username: 'Test' },
        date: '2017-11-08 Test O\'clock',
        message: input.value
      }));
      input.value = '';
    }}>
      <div className="form-group my-0 pr-0">
        <input ref={el => input = el} className="form-control" type="text" name="message" placeholder="Chat" autoComplete="off" />
      </div>
    </form>
  );
};

export default connect()(ChatForm);