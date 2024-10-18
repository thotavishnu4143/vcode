import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileWord, faFileExcel, faFilePowerpoint, faFile } from '@fortawesome/free-solid-svg-icons';
import '../styles/FilePage.css';

const FilePage = ({ encryptionKey }) => {
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  // Get the appropriate icon based on the file type
  const getFileIcon = (fileName) => {
    const fileExtension = fileName.split('.').pop().toLowerCase();

    switch (fileExtension) {
      case 'pdf':
        return <FontAwesomeIcon icon={faFilePdf} />;
      case 'docx':
      case 'doc':
        return <FontAwesomeIcon icon={faFileWord} />;
      case 'xlsx':
      case 'xls':
        return <FontAwesomeIcon icon={faFileExcel} />;
      case 'ppt':
      case 'pptx':
        return <FontAwesomeIcon icon={faFilePowerpoint} />;
      default:
        return <FontAwesomeIcon icon={faFile} />;
    }
  };

  // Fetch existing note and files based on the encryptionKey
  useEffect(() => {
    const fetchData = async () => {
      if (!encryptionKey) return;

      // Fetch the note
      const noteRef = doc(db, "notes", encryptionKey);
      const noteDocSnap = await getDoc(noteRef);
      if (noteDocSnap.exists()) {
        const encryptedNote = noteDocSnap.data().content;
        const decryptedNote = CryptoJS.AES.decrypt(encryptedNote, encryptionKey).toString(CryptoJS.enc.Utf8);
        setNote(decryptedNote);
      } else {
        setNote('');
      }

      // Fetch the files
      const fileRef = doc(db, "files", encryptionKey);
      const fileDocSnap = await getDoc(fileRef);
      if (fileDocSnap.exists()) {
        setFileList(fileDocSnap.data().files || []);
      } else {
        setFileList([]);
      }
    };

    fetchData();
  }, [encryptionKey]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const saveNote = async () => {
    if (!encryptionKey) return alert('Please enter encryption key');
    const encryptedNote = CryptoJS.AES.encrypt(note, encryptionKey).toString();
    try {
      await setDoc(doc(db, "notes", encryptionKey), {
        content: encryptedNote,
        createdAt: new Date().toISOString(),
      });
      alert("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const saveFile = async () => {
    if (!file) return alert('Please select a file first!');
    const storageRef = ref(storage, `files/${encryptionKey}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("File upload error:", error);
        alert('Error uploading file');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const fileData = { fileName: file.name, downloadURL };

        const fileRef = doc(db, "files", encryptionKey);
        const fileDocSnap = await getDoc(fileRef);
        if (fileDocSnap.exists()) {
          const existingFiles = fileDocSnap.data().files || [];
          await setDoc(fileRef, { files: [...existingFiles, fileData] }, { merge: true });
        } else {
          await setDoc(fileRef, { files: [fileData] });
        }

        setFileList((prev) => [...prev, fileData]);
        alert('File saved successfully!');
      }
    );
  };

  const downloadFile = (file) => {
    const fileURL = file.downloadURL;
    if (fileURL) {
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = file.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert(`${file.fileName} has been downloaded successfully!`);
    } else {
      alert("Error: File URL is not defined");
    }
  };

  const deleteFile = async (file) => {
    const fileRef = ref(storage, `files/${encryptionKey}/${file.fileName}`);
    try {
      await deleteObject(fileRef);

      const fileDocRef = doc(db, "files", encryptionKey);
      const fileDocSnap = await getDoc(fileDocRef);

      if (fileDocSnap.exists()) {
        const remainingFiles = fileDocSnap.data().files.filter(f => f.fileName !== file.fileName);
        await setDoc(fileDocRef, { files: remainingFiles });
      }

      setFileList(fileList.filter(f => f.fileName !== file.fileName));
      alert("File deleted successfully!");

    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        alert("File does not exist in Storage. It may have already been deleted.");
      } else {
        console.error("Error deleting file:", error);
        alert("Error deleting file. Please check the console for more details.");
      }
    }
  };

  const closePage = () => {
    navigate('/');
  };

  return (
    <div className="file-page">
      <div className="left-side">
        <h2>NotePad</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type your notes here..."
        />
        <div className="buttons">
          <button onClick={saveNote}>Save Note</button>
          <button onClick={() => setNote('')}>Clear Notes</button>
        </div>
      </div>

      <div className="right-side">
        <h2>File Upload</h2>
        <input type="file" onChange={handleFileChange} />
        <progress value={uploadProgress} max="100" />
        <div className="buttons">
          <button onClick={saveFile}>Save File</button>
          <button onClick={closePage}>Close</button>
        </div>

        <h2>Uploaded Files</h2>
        {fileList.length > 0 ? (
          <ul>
            {fileList.map((file, index) => (
              <li key={index} className="file-item">
                <span className="file-icon">{getFileIcon(file.fileName)}</span>
                <span className="file-name">{file.fileName}</span>
                <button onClick={() => downloadFile(file)}>Download</button>
                <button onClick={() => deleteFile(file)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded for this key.</p>
        )}
      </div>
    </div>
  );
};

export default FilePage;
