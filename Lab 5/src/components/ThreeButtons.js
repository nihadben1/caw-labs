import React, { useState } from "react";

function ThreeButtons() {
  var clickedState = useState(null);
  var clicked = clickedState[0];
  var setClicked = clickedState[1];

  return (
    <div>
      <button onClick={function(){setClicked(1)}}>button1</button>
      <button onClick={function(){setClicked(2)}}>button2</button>
      <button onClick={function(){setClicked(3)}}>button3</button>

      {clicked ? <p>button #{clicked} was clicked</p> : null}
    </div>
  );
}

export default ThreeButtons;
