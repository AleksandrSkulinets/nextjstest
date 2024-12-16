import * as React from "react";

function IconMenu(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="2em"
      width="2em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M18 18v2H6v-2h12zm3-7v2H3v-2h18zm-3-7v2H6V4h12z" />
    </svg>
  );
}
export default IconMenu;