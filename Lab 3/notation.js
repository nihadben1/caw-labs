function mean(scr) {
  let sum = 0;
  for (let i = 0; i < scr.length; i++) {
    sum += scr[i];
  }
  return sum / scr.length;
}

module.exports = { mean };