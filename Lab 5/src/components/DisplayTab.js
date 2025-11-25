import React, { useState } from "react";

function DisplayTab(props) {
  var tabState = useState(props.data);
  var tab = tabState[0];
  var setTab = tabState[1];

  function removeItem(index) {
    var newTab = [];
    for (var i = 0; i < tab.length; i++) {
      if (i !== index) {
        newTab.push(tab[i]);
      }
    }
    setTab(newTab);
  }

  return (
    <div>
      {tab.map(function(el, idx){
        return <p key={idx} onClick={function(){removeItem(idx)}}>
          element {idx + 1} is: {el}
        </p>
      })}
    </div>
  );
}

export default DisplayTab;
