import React from 'react';
import { connect } from 'react-redux';
import { UncontrolledDropdown as Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const LeagueSwitcher = ({ league, myLeagues }) => {
  if (!league) return '';
  if (myLeagues.length < 2) return league.name;
  return (
    <Dropdown>
      <DropdownToggle caret>
        {league.name}
      </DropdownToggle>
      <DropdownMenu>
        {myLeagues.map(league => (
          <DropdownItem key={league.id}>
            {league.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

const mapStateToProps = ({ league, myLeagues }) => ({ league, myLeagues });

export default connect(mapStateToProps)(LeagueSwitcher);