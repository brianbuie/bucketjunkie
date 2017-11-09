import React from 'react';
import { connect } from 'react-redux';
import { setPage } from '../../actions';

const ContentLinkComponent = (props) => (
  <a href="" {...props}>
    {props.children}
  </a>
);

const mapStateToProps = (state, ownProps) => ({
  className: ownProps.page === state.page ? 'active' : ''
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: e => {
    e.preventDefault();
    dispatch(setPage(ownProps.page));
  }
});

const ContentLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentLinkComponent);

export default ContentLink;