const StatsBar = ({ label, value }) => {
  return (
    <div className="component-stats-bar">
      <div className="label">{`${label}:`}</div>
      <div className="value">{value}</div>
    </div>
  );
};

export default StatsBar;
