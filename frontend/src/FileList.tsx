import { observer } from 'mobx-react-lite';
import { store } from './store';
import { ChangeEvent, useState } from 'react';

const FileList = observer(() => {
  const [fileInput, setFileInput] = useState<File | null>(null);  // Corrected type

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileInput(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!fileInput) {
      alert('Please select a file to upload.');
      return;
    }

    store.uploadFile(fileInput, fileInput.name);
  };

  return (
    <div>
      <h1>File Upload to S3</h1>
      <input type="file" onChange={handleFileInput} />
      <button onClick={uploadFile}>Upload</button>
      {store.files.map((file) => (
        <div key={file.id}>
          {file.name}
          <button onClick={() => store.deleteFile(file.id)}>Delete</button>
          <button onClick={() => store.downloadFile(file.id)}>Download</button>
        </div>
      ))}
    </div>
  );
});

export default FileList;