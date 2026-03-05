"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function generateBlueprint() {
    if (!idea.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate blueprint");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  function downloadJSON() {
    if (!result) return;

    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blueprint.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>AI Architecture Generator</h1>
          <p style={styles.subtitle}>
            Turn product ideas into structured engineering blueprints.
          </p>
        </header>

        {/* Input Section */}
        <section style={styles.card}>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={6}
            placeholder="Describe your application idea..."
            style={styles.textarea}
          />

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button
              onClick={generateBlueprint}
              disabled={loading}
              style={{
                ...styles.primaryButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Generating..." : "Generate Blueprint"}
            </button>

            {result && (
              <button onClick={downloadJSON} style={styles.secondaryButton}>
                Download JSON
              </button>
            )}
          </div>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}
        </section>

        {/* Results Section */}
        {result && (
          <section style={{ marginTop: 40 }}>
            {/* Summary */}
            <div style={styles.resultCard}>
              <h2 style={styles.sectionTitle}>Summary</h2>
              <p style={styles.summaryText}>{result.summary}</p>
            </div>

            {/* Features */}
            <div style={styles.resultCard}>
              <h2 style={styles.sectionTitle}>Core Features</h2>
              <ul style={styles.featureList}>
                {result?.features?.map((feature: string, index: number) => ( 
                  <li key={index} style={styles.featureItem}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Database */}
            <div style={styles.resultCard}>
              <h2 style={styles.sectionTitle}>Database Schema</h2>

              {result?.database_tables?.map((table: any, index: number) =>  (
                <div key={index} style={styles.tableCard}>
                  <h3 style={styles.tableTitle}>{table.name}</h3>

                  <div style={styles.columnGrid}>
                    {{table?.columns?.map(
                      (column: string, colIndex: number) => (
                        <div key={colIndex} style={styles.columnChip}>
                          {column}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!result && !loading && (
          <div style={styles.emptyState}>
            Your generated blueprint will appear here.
          </div>
        )}
      </div>
    </main>
  );
}

/* ------------------ STYLES ------------------ */

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    padding: "60px 20px",
    display: "flex",
    justifyContent: "center",
  },

  container: {
    width: "100%",
    maxWidth: 1000,
  },

  header: {
    textAlign: "center",
    marginBottom: 40,
    color: "white",
  },

  title: {
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 10,
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: 16,
  },

  card: {
    background: "white",
    padding: 30,
    borderRadius: 14,
    boxShadow: "0 15px 50px rgba(0,0,0,0.25)",
  },

  textarea: {
    width: "100%",
    padding: 16,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: 16,
    resize: "vertical",
    outline: "none",
  },

  primaryButton: {
    background: "#0f172a",
    color: "white",
    padding: "12px 22px",
    borderRadius: 8,
    border: "none",
    fontSize: 15,
    cursor: "pointer",
  },

  secondaryButton: {
    background: "white",
    color: "#0f172a",
    padding: "12px 22px",
    borderRadius: 8,
    border: "1px solid #0f172a",
    fontSize: 15,
    cursor: "pointer",
  },

  errorBox: {
    marginTop: 20,
    padding: 12,
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: 8,
  },

  resultCard: {
    background: "white",
    padding: 30,
    borderRadius: 14,
    marginBottom: 25,
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
  },

  sectionTitle: {
    fontSize: 20,
    marginBottom: 15,
  },

  summaryText: {
    color: "#334155",
    lineHeight: 1.6,
  },

  featureList: {
    paddingLeft: 20,
  },

  featureItem: {
    marginBottom: 8,
  },

  tableCard: {
    marginBottom: 20,
    padding: 20,
    background: "#f8fafc",
    borderRadius: 10,
  },

  tableTitle: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 600,
  },

  columnGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 10,
  },

  columnChip: {
    background: "white",
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #e2e8f0",
    fontSize: 14,
  },

  emptyState: {
    marginTop: 50,
    textAlign: "center",
    color: "#94a3b8",
  },
};