import React from 'react';
import { Link } from 'react-router-dom';

const ContentMenu = ({ leagueName }) => (
<div className="d-flex py-3">
  <h4 className="my-0 mr-3">
    {leagueName}
  </h4>
  <div className="flex-grow d-flex px-3 justify-content-between align-items-center">
    <Link to='/dash/'>
      <span className="fa fa-user-circle" />
    </Link>
    <Link to='/dash/players'>
      <span className="fa fa-user-plus" />
    </Link>
    <Link to='/dash/info'>
      <span className="fa fa-info-circle" />
    </Link>
    <Link to='/dash/edit'>
      <span className="fa fa-pencil-square" />
    </Link>
  </div>
</div>
);

export default ContentMenu;