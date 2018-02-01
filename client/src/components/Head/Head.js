import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

const Head = ({ title, description, titleNotifications }) => (
  <Helmet>
    <title>{
      titleNotifications.shouldDisplay && titleNotifications.amount 
        ? `(${titleNotifications.amount}) ${title}` 
        : title
    }</title>
    <description>{description}</description>
  </Helmet>
);

export default connect(
  ({ documentHead, notifications }) => ({ ...documentHead, ...notifications })
)(Head);