import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCompare, clearCompare } from "../../redux/slices/compareSlice";
import "./CompareBar.css";

const CompareBar = () => {
  const compareList = useSelector((state) => state.compare.compareList);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  return (
    <div className="compare-bar">
      <div className="compare-bar-list">
        {compareList.map((property) => (
          <div className="compare-bar-item" key={property._id}>
            <img src={property.image} alt={property.title} className="compare-bar-img" />
            <div className="compare-bar-title">{property.title}</div>
            <button className="compare-bar-remove" onClick={() => dispatch(removeFromCompare(property._id))}>×</button>
          </div>
        ))}
      </div>
      <button
        className="compare-bar-btn"
        disabled={compareList.length < 2}
        onClick={() => navigate("/compare")}
      >
        Compare ({compareList.length})
      </button>
      <button className="compare-bar-clear" onClick={() => dispatch(clearCompare())}>Clear All</button>
    </div>
  );
};

export default CompareBar;
