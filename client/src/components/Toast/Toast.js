import React from 'react';
import { connect } from 'react-redux';
import './Toast.scss';

const Toast = ({ toast, dismissToast }) => toast ? (
  <div className="Toast__Container">
    <div className={`alert alert-${toast.meta.ok ? 'success' : 'danger'}`} role="alert">
      <button className="close" type="button" onClick={dismissToast}> 
        <span> &times; </span>
      </button>
      {toast.json.message}
    </div>
  </div>
) : '';

const mapStateToProps = state => ({
  toast: state.toast
});

const mapDispatchToProps = dispatch => ({
  dismissToast: () => {
    console.log('dismiss called');
    dispatch({ type: 'DISMISSED_TOAST' })
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toast);
