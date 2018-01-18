import React from 'react';
import { connect } from 'react-redux';
import { hideToast } from 'actions';
import Transition from 'react-transition-group/Transition';
import './Toast.scss';

const duration = 300;

const defaultStyle = {
  transition: `all ${duration}ms ease`,
}

const transitionStyles = {
  entering: {
    transform: 'translate3d(0, -100%, 0)',
    maxHeight: '0px',
    opacity: 0,
  },
  entered: {
    transform: 'translate3d(0, 0, 0)',
    maxHeight: '100px',
    opacity: 1,
  },
  exiting: {
    opacity: 0
  },
  exited: {
    display: 'none',
  }
}

const Toast = ({ toasts, hideToast }) => (
  <div className="Toast__Container">
    {toasts.map((toast, key) => (
      <Transition in={!toast.hidden} timeout={duration} key={key} appear>
        {state => (
          <div
            style={{ ...defaultStyle, ...transitionStyles[state] }}
            className={`alert alert-${toast.toastType} flex-row justify-content-center`} 
            role="alert"
          >
            <span className="flex-grow">{toast.text}</span>
            <button className="close" type="button" onClick={() => hideToast(toast.id)}> 
              <span> &times; </span>
            </button>
          </div>
        )}
      </Transition>
    ))}
  </div>
);

const mapStateToProps = ({ toasts }) => ({ toasts });

const mapDispatchToProps = dispatch => ({
  hideToast: id => dispatch(hideToast(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toast);
