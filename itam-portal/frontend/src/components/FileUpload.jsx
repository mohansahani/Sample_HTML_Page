import { useState } from 'react';

export default function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setBusy(true);
    try {
      await onUpload(file);
      setFile(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={e => setFile(e.target.files?.[0] || null)}/>
      <button className="btn" onClick={handleUpload} disabled={!file || busy}>{busy ? 'Uploading...' : 'Upload'}</button>
    </div>
  );
}