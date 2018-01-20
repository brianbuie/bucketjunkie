import React from 'react';
import BurgerMenu from 'react-burger-menu/lib/menus/slide';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Nav from 'components/Nav/Nav';
import routes from 'routes';

class NavContainer extends React.Component {

  componentWillMount = () => this.setState({ isOpen: false })

  onStateChange = state => this.setState({ ...state });

  componentWillReceiveProps = newProps => {
    if (newProps.loc != this.props.loc && this.state.isOpen) this.setState({ isOpen: false });
  }

  render = () => (
    <div className="full-height">
      <div className="height-100 d-lg-none">
        <BurgerMenu width="200px" onStateChange={this.onStateChange} isOpen={this.state.isOpen}>
          <Nav {...this.props} />
        </BurgerMenu>
      </div>
      <div className="height-100 d-none d-lg-block">
        <Nav {...this.props} />
      </div>
    </div>
  )
}

export default withRouter(connect(
  ({ teams, router, league }) => ({ teams, league, loc: router.location })
)(NavContainer));