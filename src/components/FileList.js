import React from 'react';

function FileList({ files }) {
  return (
    <ul>
      {files.map((file, index) => (
        <li key={index}>
          {file.name} - <a href={file.url} target="_blank" rel="noopener noreferrer">Download</a>
        </li>
      ))}
    </ul>
  );
}

export default FileList;  // Ensure the export is correct
