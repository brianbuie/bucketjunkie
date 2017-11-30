import React from 'react';
import { connect } from 'react-redux';
import { UncontrolledDropdown as Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { 
  minimizeActivity,
  maximizeActivity,
  dockActivity,
  undockActivity
} from 'actions';
import { A } from 'components/Utilities';
import AccountLauncher from 'components/Account/AccountLauncher';

const ActivityMenuBar = ({ 
  docked,
  minimized,
  league,
  myLeagues,
  minimizeActivity,
  maximizeActivity,
  dockActivity,
  undockActivity
}) => (
  <div className="bg-dark d-flex flex-row p-1">
    <Dropdown className="mr-auto">
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
    <AccountLauncher />
    {docked
      ? <A click={() => undockActivity()}><i className="fa fa-toggle-left m-1"></i></A>
      : <A click={() => dockActivity()}><i className="fa fa-toggle-right m-1"></i></A>
    }
    {!docked
      ? minimized
        ? <A click={() => maximizeActivity()}><i className="fa fa-plus m-1"></i></A>
        : <A click={() => minimizeActivity()}><i className="fa fa-minus m-1"></i></A>
      : ''
    }
  </div>
);

const mapStateToProps = ({ 
  activity,
  league, 
  myLeagues 
}) => ({ 
  docked: activity.docked,
  minimized: activity.minimized,
  league, 
  myLeagues 
});

const mapDispatchToProps = dispatch => ({
  minimizeActivity: () => dispatch(minimizeActivity()),
  maximizeActivity: () => dispatch(maximizeActivity()),
  dockActivity: () => dispatch(dockActivity()),
  undockActivity: () => dispatch(undockActivity())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityMenuBar);