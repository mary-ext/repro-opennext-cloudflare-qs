"use client";

import { useState } from "react";

/**
 * Minimal reproduction for OpenNext query string encoding bug.
 *
 * OpenNext's request pipeline decodes URL query parameters via URLSearchParams
 * but reconstructs req.url with raw string interpolation, losing percent-encoding.
 * Characters like & = + in query values get interpreted as URL delimiters.
 *
 * @see https://github.com/opennextjs/opennextjs-aws/issues/854
 */
export default function Home() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testQuery = async () => {
    setLoading(true);
    const input = JSON.stringify({ search: "Blake & Mortimer" });
    const url = `/api/echo?input=${encodeURIComponent(input)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(`Fetch error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>OpenNext Query String Encoding Bug</h1>
      <p>
        This sends a GET request with a JSON-encoded query parameter containing
        an ampersand (<code>&amp;</code>):
      </p>
      <pre>
        {`GET /api/echo?input=${encodeURIComponent(JSON.stringify({ search: "Blake & Mortimer" }))}`}
      </pre>

      <p>
        <strong>Expected:</strong> The API route receives the full JSON string{" "}
        <code>{`{"search":"Blake & Mortimer"}`}</code>
      </p>
      <p>
        <strong>Actual (with OpenNext):</strong> The <code>&amp;</code> in the
        decoded value acts as a query separator, truncating the JSON to{" "}
        <code>{`{"search":"Blake `}</code> and creating a spurious{" "}
        <code>Mortimer&quot;{`}`}</code> parameter.
      </p>

      <button onClick={testQuery} disabled={loading}>
        {loading ? "Loading..." : "Test Query"}
      </button>

      {result && <pre className="result">{result}</pre>}
    </>
  );
}
