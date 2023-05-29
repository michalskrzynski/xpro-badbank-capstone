function decodeJwt(token) {
  // Split the JWT into three parts: header, payload, and signature
  const parts = token.split('.');
  // Get the encoded payload from the second part
  const encodedPayload = parts[1];
  const decodedPayload = atob(encodedPayload);
  const parsedPayload = JSON.parse(decodedPayload);
  return parsedPayload;
}


module.exports = decodeJwt;