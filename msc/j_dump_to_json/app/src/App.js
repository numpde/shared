function App() {
  // Pre-populate with your long path + convenience options.
  const fileOptions = [
    {
      label:
        "last.ckpt / data-cheese-split / subsample=200 / summaries.json",
      url:
        "../lambda__full_alberts_55_klcomp__20250621-0617_GPT2MultiHeadModel__checkpoints__last.ckpt/source=data-cheese-split__split=test__at_most=10000__downsize_to=10000__do_chemberta=True__do_func_grps=True/subsample=200/summaries.json",
    },
    { label: "— Select a file —", url: "" },
    { label: "Custom URL…", url: "__custom__" },
  ];

  const [selectedUrl, setSelectedUrl] = React.useState(fileOptions[0].url);
  const [customUrl, setCustomUrl] = React.useState("");
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!selectedUrl || selectedUrl === "__custom__") return;
    load(selectedUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUrl]);

function withNoCache(u) {
  const url = new URL(u, window.location.href);
  url.searchParams.set("_ts", Date.now().toString());
  console.log("Fetching URL:", url.toString());
  return url.toString();
}

  function load(url) {
    setLoading(true);
    setError("");
    setData(null);

    url = withNoCache(url);

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json();
      })
      .then((j) => setData(j))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }

  function onChoose(url) {
    setSelectedUrl(url);
  }

  function onLoadCustom() {
    if (customUrl.trim()) {
      load(customUrl.trim());
      setSelectedUrl("__custom__");
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">SMILES Predictions Viewer</h1>
      </header>

      <section className="controls">
        <FileSelect
          options={fileOptions}
          selectedUrl={selectedUrl}
          onChange={onChoose}
        />
        {selectedUrl === "__custom__" && (
          <div className="custom-url">
            <input
              className="input"
              placeholder="https://…/summaries.json or relative/path.json"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
            />
            <button className="btn" onClick={onLoadCustom}>Load</button>
          </div>
        )}
      </section>

      {loading && <div className="status">Loading…</div>}
      {error && <div className="status status--error">Error: {error}</div>}

      {!loading && !error && data && (
        <SmilesViewer data={data}/>
      )}

      {!loading && !error && !data && (
        <p className="hint">Select a JSON file to load predictions.</p>
      )}
    </div>
  );
}
