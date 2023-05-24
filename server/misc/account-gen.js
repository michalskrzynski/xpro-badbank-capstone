function generate() {
  
  let result = "";
  for(let i = 1; i<=16; i++) {
    result += Math.round(Math.random()*9);
    if( i%4 === 0 && i!==16 ) result += "-";
  }
  return result;

}

module.exports = generate;