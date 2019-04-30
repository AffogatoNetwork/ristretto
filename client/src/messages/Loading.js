import React from "react";
import "./Loading.css";
import { Icon } from "rimble-ui";

const Loading = () => (
  <div className="loading-wrapper">
    <Icon name="MoneyOff" className="loading-icon" />
    <h4 className="mt-0">Loading...</h4>
  </div>
);

export default Loading;
