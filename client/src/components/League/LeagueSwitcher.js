import React from 'react';
import { connect } from 'react-redux';
import { UncontrolledDropdown as Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { setLeague } from 'actions';

const LeagueSwitcher = ({ league, myLeagues, setLeague }) => {
  if (!league) return '';
  if (myLeagues.length < 2) return league.name;
  return (
    <Dropdown>
      <DropdownToggle color="link" caret>
        {league.name}
      </DropdownToggle>
      <DropdownMenu>
        {myLeagues.map(league => (
          <DropdownItem onClick={() => setLeague(league._id)} key={league._id}>
            {league.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

const mapStateToProps = ({ league, myLeagues }) => ({ league, myLeagues });

const mapDispatchToProps = dispatch => ({
  setLeague: id => dispatch(setLeague(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeagueSwitcher);