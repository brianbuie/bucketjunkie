import React from 'react';
import { connect } from 'react-redux';
import League from '../../components/League/League';
import { getMyLeagues } from '../../actions';

class MyLeagues extends React.Component {

  componentDidMount() {
    this.props.getMyLeagues();
  }

  render() {
    return (
      <div className="row no-gutters height-100">
        <div className="scroll-y">
          <div className="bg-light col-sm-10 col-md-8 mx-auto p-3">
            <h2 className="text-center mb-3">My Leagues</h2>
            {this.props.myLeagues.map(league => (
              <League {...league} key={league.id}/>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  myLeagues: state.myLeagues
});

const mapDispatchToProps = dispatch => ({
  getMyLeagues: () => dispatch(getMyLeagues())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyLeagues);