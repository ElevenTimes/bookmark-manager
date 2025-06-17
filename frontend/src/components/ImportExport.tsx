"use client";

import React from "react";

type ImportExportProps = {
  onImportComplete?: () => void;
};

const ImportExport: React.FC<ImportExportProps> = ({ onImportComplete }) => {

  const importSql = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/bookmark/import-sql", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Import failed");

      alert("✅ Import successful!");

      onImportComplete?.();
    } catch (err) {
      console.error("❌ Import error:", err);
      alert("❌ Import failed.");
    }
  };

  const exportFile = async (type: "sql" | "html") => {
    try {
      const response = await fetch(`/api/bookmark/export-${type}`);
      if (!response.ok) throw new Error("Failed to export bookmarks");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `bookmarks_export.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Export as ${type} failed:`, error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Import / Export</h2>

      <div className="space-x-4">
        <button
          onClick={() => exportFile("html")}
          className="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded hover:brightness-110"
        >
          Export Bookmarks as HTML
        </button>
        <button
          onClick={() => exportFile("sql")}
          className="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded hover:brightness-110"
        >
          Export Bookmarks as SQL
        </button>
        <label
          htmlFor="import-sql"
          className="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded hover:brightness-110 cursor-pointer inline-block"
        >
          Import SQL
          <input
            id="import-sql"
            type="file"
            accept=".sql"
            onChange={importSql}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default ImportExport;



