import React, { useState } from "react";

function ToggleButton() {
  var countState = useState(0);
  var count = countState[0];
  var setCount = countState[1];

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <button onClick={handleClick}>clickme</button>
      <p>{count % 2 === 0 ? "clicked" : "not clicked"}</p>
    </div>
  );
}

export default ToggleButton;
