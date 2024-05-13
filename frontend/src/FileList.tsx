import { observer } from 'mobx-react-lite';
import { store } from './store';
import { ChangeEvent, useState } from 'react';
import './styles/FileList.scss';

const FileList = observer(() => {
  const [fileInput, setFileInput] = useState<File | null>(null);

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
      <h1>Files Upload to S3</h1>
      <input type="file" onChange={handleFileInput} />
      <button onClick={uploadFile}>Upload</button>
      <div className='files-container'>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>File Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {store.files.map((file) => (
              <tr key={file.fileId}>
                <td>{file.fileId}</td>
                <td>{file.fileName}</td>
                <td>
                  <button className='action-button' onClick={() => store.deleteFile(file.fileId)}>Delete</button>
                  <button className='action-button' onClick={() => store.downloadFile(file.fileId)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default FileList;
