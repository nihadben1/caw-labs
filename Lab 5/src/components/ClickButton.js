import React, { useState } from "react";

function ClickButton() {
  var clickedState = useState(false);
  var clicked = clickedState[0];
  var setClicked = clickedState[1];

  function handleClick() {
    setClicked(true);
  }

  return (
    <div>
      <button onClick={handleClick}>clickme</button>
      {clicked ? <p>clicked</p> : null}
    </div>
  );
}

export default ClickButton;
