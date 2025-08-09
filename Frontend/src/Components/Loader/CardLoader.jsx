import React from "react";
import "./CardLoader.css";

const CardLoader = ({ count = 3 }) => (
  <div className="card-loader-wrapper">
    {Array.from({ length: count }).map((_, idx) => (
      <div className="card-loader" key={idx}>
        <div className="card-loader-img" />
        <div className="card-loader-content">
          <div className="card-loader-title" />
          <div className="card-loader-rating" />
          <div className="card-loader-price" />
        </div>
      </div>
    ))}
  </div>
);

export default CardLoader;
