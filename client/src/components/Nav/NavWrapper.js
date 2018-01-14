import React from 'react';
import BurgerMenu from 'react-burger-menu/lib/menus/slide';
import Nav from 'components/Nav/Nav';
import { A } from 'components/Utilities';

const NavWrapper = () => (
  <div className="full-height">
    <div className="Nav--Mobile height-100">
      <BurgerMenu>
        <Nav />
      </BurgerMenu>
    </div>
    <div className="Nav--Desktop height-100">
      <Nav />
    </div>
  </div>
);

export default NavWrapper;