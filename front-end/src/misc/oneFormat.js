import numeral from "numeral";

export function oneFormat( num ) {
  return numeral( num/100 ).format("0,0.00$");
}