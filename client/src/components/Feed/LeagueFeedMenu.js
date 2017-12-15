import React from 'react';
import { A } from 'components/Utilities';

const LeagueFeedMenu = ({ view, changeView, menuItems }) => (
  <div className="LeagueFeed__Menu">
    {menuItems.map(item => (
      <A 
        className="LeagueFeed__Menu__Item py-2"
        click={() => changeView(item.name)} 
        active={view === item.name}
        key={item.name}
      >
        {item.text}
      </A>
    ))}
  </div>
);

export default LeagueFeedMenu;