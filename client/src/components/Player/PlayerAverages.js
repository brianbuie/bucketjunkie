import React from 'react';

const PlayerAverages = ({ averages }) => (
  <table style={{width: '100%'}}>
    <tbody>
      <tr>
        {Object.keys(averages).map((category, key) => (
          <td className="faded-2 text-center text-sm" key={key}>
            {category.toUpperCase()}
          </td>
        ))}
      </tr>
      <tr>
        {Object.keys(averages).map((category, key) => (
          <td className="text-center" key={key}>
            {Math.round(averages[category])}
          </td>
        ))}
      </tr>
    </tbody>
  </table>
);

export default PlayerAverages;