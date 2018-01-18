import React from 'react';
import Transition from 'react-transition-group/Transition';

const defaultDuration = 300;

const defaultTransitionStyles = {
  default: {
    entering: {},
    entered: { transform: 'translate3d(0, 0, 0)' },
    exiting: {},
    exited: { display: 'none' }
  },
  left: {
    entering: { transform: 'translate3d(100%, 0, 0)' },
    exiting: { transform: 'translate3d(100%, 0, 0)' }
  },
  right: {
    entering: { transform: 'translate3d(-100%, 0, 0)' },
    exiting: { transform: 'translate3d(-100%, 0, 0)' },
  },
  up: {
    entering: { transform: 'translate3d(0, 100%, 0)' },
    exiting: { transform: 'translate3d(0, 100%, 0)' },
  },
  down: {
    entering: { transform: 'translate3d(0, -100%, 0)' },
    exiting: { transform: 'translate3d(0, -100%, 0)' },
  },
}

const SlideIn = ({ Component, direction, transitionStyles, defaultStyle, duration, inProp }) => (
  <Transition in={inProp} timeout={duration || defaultDuration} appear mountOnEnter unmountOnExit>
    {state => {
      let style = { transition: `all ${duration || defaultDuration}ms ease` };

      // if default style override is provided, use it
      if (defaultStyle) style = { ...style, ...defaultStyle };

      // default transition style
      style = { ...style, ...defaultTransitionStyles['default'][state] };

      // direction specific transition style
      if (defaultTransitionStyles[direction][state]) style = { ...style, ...defaultTransitionStyles[direction][state] };

      // apply transitionstyles prop if given
      if (transitionStyles) style = { ...style, ...transitionStyles[state] };

      console.log(state);
      console.log(style);

      return <Component style={style} />
    }}
  </Transition>
);

export default SlideIn;
