import React from 'react';

const ChatForm = ({ chatSubmit }) => {
  let input;
  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!input.value.trim()) return;
      chatSubmit(input.value);
      input.value = '';
    }}>
      <div className="form-group my-0 pr-0">
        <input ref={el => input = el} className="form-control" type="text" name="message" placeholder="Chat" autoComplete="off" />
      </div>
    </form>
  );
};

export default ChatForm;