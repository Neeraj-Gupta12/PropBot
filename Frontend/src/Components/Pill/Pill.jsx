import './Pill.css';

const Pill = ({ label, onClick }) => (
  <span className="pill" onClick={onClick}>
    {label}
  </span>
);

export default Pill;
