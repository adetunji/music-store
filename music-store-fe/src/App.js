// App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [songs, setSongs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const response = await axios.get('http://localhost:3010/music');
    setSongs(response.data);
  };

  const fileSelectedHandler = event => {
    setSelectedFile(event.target.files[0]);
  };

  const fileUploadHandler = async () => {
    const formData = new FormData();
    formData.append('music', selectedFile);
    await axios.post('http://localhost:3010/upload', formData);
    fetchSongs();
  };

  return (
    <div className="App">
      <input type="file" onChange={fileSelectedHandler} />
      <button onClick={fileUploadHandler}>Upload</button>
      {songs.map((song, index) => (
        <div key={index}>
          <audio controls>
            <source src={`http://localhost:3010/music/${song}`} type="audio/mpeg" />
          </audio>
        </div>
      ))}
    </div>
  );
}

export default App;