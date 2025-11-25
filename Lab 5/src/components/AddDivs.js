import React, { useState } from "react";

function AddDivs() {
  var divsState = useState([]);
  var divs = divsState[0];
  var setDivs = divsState[1];

  var hState = useState("");
  var h = hState[0];
  var setH = hState[1];

  var wState = useState("");
  var w = wState[0];
  var setW = wState[1];

  var colorState = useState("");
  var color = colorState[0];
  var setColor = colorState[1];

  function submit(e) {
    e.preventDefault();
    var newDivs = [];
    for (var i = 0; i < divs.length; i++) {
      newDivs.push(divs[i]);
    }
    newDivs.push({h: h, w: w, color: color});
    setDivs(newDivs);
    setH("");
    setW("");
    setColor("");
  }

  return (
    <div>
      <form onSubmit={submit}>
        <input placeholder="height" value={h} onChange={function(e){setH(e.target.value)}}/>
        <input placeholder="width" value={w} onChange={function(e){setW(e.target.value)}}/>
        <input placeholder="color" value={color} onChange={function(e){setColor(e.target.value)}}/>
        <button type="submit">add div</button>
      </form>

      {divs.map(function(d, i){
        return <div key={i} style={{height:d.h+"px", width:d.w+"px", background:d.color, margin:"10px"}}></div>
      })}
    </div>
  );
}

export default AddDivs;
