import {emptyContext} from "../components/Context";

export function frontLogout() {
  localStorage.removeItem("RefreshToken");
  return emptyContext;
}
