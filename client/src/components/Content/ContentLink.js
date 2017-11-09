import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

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
    dispatch(actions.setPage(ownProps.page));
    dispatch(actions.fetchPage(ownProps.fetch));
  }
});

const ContentLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentLinkComponent);

export default ContentLink;