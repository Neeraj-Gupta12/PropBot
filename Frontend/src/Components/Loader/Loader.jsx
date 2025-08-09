import './Loader.css'; 

const Loader = ({ type, size = 'medium' }) => {
  return (
    <div className="loader-container">
      {type === 'page' ? (
        <div className={`dot-loader ${size}`}>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      ) : type === 'data' ? (
        <div className={`line-loader ${size}`}>
          <div className="horizontal-line"></div>
          <div className="horizontal-line"></div>
          <div className="horizontal-line"></div>
        </div>
      ) : null}
    </div>
  );
};

export default Loader;
