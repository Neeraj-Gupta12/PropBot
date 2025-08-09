import React from "react";
import { useSelector } from "react-redux";
import "./ComparePage.css";

const ComparePage = () => {
  const compareList = useSelector((state) => state.compare.compareList);

  // Always show 3 columns, fill with blanks if less than 3
  const maxCompare = 3;
  const filledCompareList = [...compareList];
  while (filledCompareList.length < maxCompare) {
    filledCompareList.push(null);
  }

  // Collect all unique amenities for table header
  const allAmenities = Array.from(
    new Set(compareList.flatMap((p) => (p?.amenities || [])))
  );

  return (
    <div className="compare-page">
      <h1>Compare Properties</h1>
      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              {filledCompareList.map((p, idx) => (
                <th key={p?._id || idx}>{p ? p.title : "-"}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Image</td>
              {filledCompareList.map((p, idx) => (
                <td key={p?._id || idx}>{p ? <img src={p.image} alt={p.title} className="compare-img" /> : "-"}</td>
              ))}
            </tr>
            <tr>
              <td>Location</td>
              {filledCompareList.map((p, idx) => <td key={p?._id || idx}>{p ? p.location : "-"}</td>)}
            </tr>
            <tr>
              <td>Price</td>
              {filledCompareList.map((p, idx) => <td key={p?._id || idx}>{p ? `$${p.price}` : "-"}</td>)}
            </tr>
            <tr>
              <td>Bedrooms</td>
              {filledCompareList.map((p, idx) => <td key={p?._id || idx}>{p ? p.bedrooms : "-"}</td>)}
            </tr>
            <tr>
              <td>Bathrooms</td>
              {filledCompareList.map((p, idx) => <td key={p?._id || idx}>{p ? p.bathrooms : "-"}</td>)}
            </tr>
            <tr>
              <td>Size (sqft)</td>
              {filledCompareList.map((p, idx) => <td key={p?._id || idx}>{p ? p.size_sqft : "-"}</td>)}
            </tr>
            <tr>
              <td>Amenities</td>
              {filledCompareList.map((p, idx) => (
                <td key={p?._id || idx}>
                  {p ? (p.amenities || []).map((a) => (
                    <span className="compare-amenity" key={a}>{a}</span>
                  )) : "-"}
                </td>
              ))}
            </tr>
            {allAmenities.map((amenity) => (
              <tr key={amenity}>
                <td>{amenity}</td>
                {filledCompareList.map((p, idx) => (
                  <td key={(p?._id || idx) + amenity}>
                    {p ? ((p.amenities || []).includes(amenity) ? "✔️" : "—") : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
