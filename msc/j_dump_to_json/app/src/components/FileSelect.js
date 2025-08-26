function FileSelect({ options, selectedUrl, onChange }) {
  return (
    <div className="file-select">
      <label className="label">Select JSON file</label>
      <select
        className="select"
        value={selectedUrl}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.label} value={opt.url}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
