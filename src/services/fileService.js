// client/src/services/fileService.js
import app from '../firebaseConfig'; // Import the default export
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions
import { getStorage, ref, uploadBytes } from 'firebase/storage'; // Import necessary Storage functions

// Initialize Firestore and Storage using the imported app
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

// Function to get files from Firestore
const getFiles = async (key) => {
    const filesCollection = collection(db, 'files'); // Adjust the collection name as per your setup
    const fileSnapshot = await getDocs(filesCollection);
    const filesList = fileSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return filesList;
};

// Function to upload files to Storage
const uploadFile = async (file, key) => {
    const storageRef = ref(storage, `files/${key}/${file.name}`); // Adjust the path as necessary
    await uploadBytes(storageRef, file);
    return { name: file.name, key }; // Return the file info or any other data you need
};

// Export the functions
export { getFiles, uploadFile };
