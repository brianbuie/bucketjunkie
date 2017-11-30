import React from 'react';
import { connect } from 'react-redux';
import League from 'components/League/League';
import { A } from 'components/Utilities';
import { getMyLeagues, setLeague } from 'actions';

class MyLeagues extends React.Component {

  componentDidMount() {
    this.props.getMyLeagues();
  }

  render() {
    return (
      <div className="height-100">
        <div className="row no-gutters">
          <div className="bg-light col-sm-10 col-md-8 mx-auto p-3">
            <h2 className="text-center mb-3">My Leagues</h2>
            {this.props.myLeagues.map(league => (
              <A click={() => this.props.setLeague(league.id)} key={league.id} className="link-discreet">
                <League {...league} />
              </A>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ myLeagues }) => ({ myLeagues });

const mapDispatchToProps = dispatch => ({
  getMyLeagues: () => dispatch(getMyLeagues()),
  setLeague: id => dispatch(setLeague(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyLeagues);