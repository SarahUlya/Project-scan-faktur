import { useState } from "react";

export default function Scan() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    console.log("Uploading file:", file.name);
    alert("File uploaded successfully!");
  };

  const handleRemove = () => {
    setFile(null);
  };
  // Logic to upload the file to the server or process it

  return (
    <div>
      <h2>Welcome to the Scan Faktur</h2>

      <input type="file" onChange={handleFileChange} />
      {file && (
        <div style={{ marginTop: "10px" }}>
          <p>Pilih File: {file.name}</p>
          <button onClick={handleRemove}>Remove</button>
        </div>
      )}
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
}