import React, { Component } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { A } from '../Utilities';
import ActivityList from './ActivityList';
import ChatForm from './ChatForm';
import './Activity.scss';

const Activity = ({ items, showChatInput, filterClick, activeFilter, filters, chatSubmit }) => (
  <div className="height-100 d-flex flex-column">
    <Nav className="nav-fill">
      {filters.map(filter => (
        <NavItem key={filter.filter}>
          <A 
            className="nav-link" 
            click={() => filterClick(filter.filter)} 
            active={activeFilter === filter.filter}
          >
            {filter.text}
          </A>
        </NavItem>
      ))}
    </Nav>
    <ActivityList items={items} />
    {showChatInput ? <ChatForm chatSubmit={chatSubmit} /> : ''}
  </div>
);

export default Activity;