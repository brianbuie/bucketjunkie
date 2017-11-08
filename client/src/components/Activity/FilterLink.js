import { connect } from 'react-redux';
import { setActivityFilter } from '../../actions';
import { NavLink } from 'reactstrap';

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.activityFilter
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(setActivityFilter(ownProps.filter))
  }
});

const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavLink);

export default FilterLink;