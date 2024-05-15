import { observer } from 'mobx-react-lite';
import { store } from './store';
import { ChangeEvent, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDownload, faEdit, faSave, faUpload } from '@fortawesome/free-solid-svg-icons';
import './styles/FileList.scss';

const FileList = observer(() => {
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [editFileId, setEditFileId] = useState<number | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileInput(e.target.files[0]);
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const uploadFile = async () => {
    if (!fileInput) {
      alert('Please select a file to upload.');
      return;
    }
    store.uploadFile(fileInput, fileInput.name);
    setSelectedFileName(''); // Clear the file name after upload
  };

  const startEditing = (fileId: number, currentName: string) => {
    setEditFileId(fileId);
    setNewFileName(currentName);
  };

  const saveFileName = (fileId: number) => {
    store.updateFileName(fileId, newFileName);
    setEditFileId(null);
    setNewFileName('');
  };

  return (
    <div>
      <h1>Files Upload to S3</h1>
      <div className="file-input-container">
        <input
          type="file"
          className="file-input"
          ref={fileInputRef}
          onChange={handleFileInput}
        />

        <button
          className="action-button"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <FontAwesomeIcon icon={faUpload} /> Select File
        </button>

        {selectedFileName && <span className="file-name">{selectedFileName}</span>}
      </div>
      <button className="button-upload" onClick={uploadFile}>
        Upload
      </button>
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
                <td>
                  {editFileId === file.fileId ? (
                    <input 
                      type="text" 
                      value={newFileName} 
                      onChange={(e) => setNewFileName(e.target.value)} 
                    />
                  ) : (
                    file.fileName
                  )}
                </td>
                <td>
                  {editFileId === file.fileId ? (
                    <button className='action-button' onClick={() => saveFileName(file.fileId)}>
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                  ) : (
                    <button className='action-button' onClick={() => startEditing(file.fileId, file.fileName)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  )}
                  <button className='action-button' onClick={() => store.deleteFile(file.fileId)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button className='action-button' onClick={() => store.downloadFile(file.fileId)}>
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
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
