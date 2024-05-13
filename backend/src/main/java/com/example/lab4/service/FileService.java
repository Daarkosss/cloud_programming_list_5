package com.example.lab4.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.example.lab4.entity.FileReference;
import com.example.lab4.repository.FileReferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    @Value("${bucket.name}")
    private String BUCKET_NAME = "files-app-bucket-v1";
    private final FileReferenceRepository fileReferenceRepository;
    private final AmazonS3 amazonS3;

    public FileReference uploadFile(String fileName, MultipartFile file) throws IOException {
        String s3Key = saveFileInS3AndGetKey(file);
        return saveFileReference(s3Key, fileName);
    }

    private String saveFileInS3AndGetKey(MultipartFile file) throws IOException {
        String key = UUID.randomUUID().toString();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        amazonS3.putObject(BUCKET_NAME, key, file.getInputStream(), metadata);
        return key;
    }

    private FileReference saveFileReference(String s3Key, String fileName) {

        FileReference fileReference = FileReference.builder()
                .fileName(fileName)
                .fileLink(amazonS3.getUrl(BUCKET_NAME, s3Key).toString())
                .s3Key(s3Key)
                .build();

        return fileReferenceRepository.save(fileReference);

    }

    public List<FileReference> getAllFiles() {
        return fileReferenceRepository.findAll();
    }


    private FileReference getFileById(Long fileId) {
        return fileReferenceRepository.findById(fileId).orElseThrow(() -> new NotFoundException("File not found"));
    }

    public FileReference deleteFile(Long fileId) {
        FileReference fileReference = getFileById(fileId);
        amazonS3.deleteObject(BUCKET_NAME, fileReference.getS3Key());
        fileReferenceRepository.delete(fileReference);
        return fileReference;
    }

    public FileReference updateFile(Long fileId, String newName) {
        FileReference fileReference = getFileById(fileId);
        fileReference.setFileName(newName);
        return fileReferenceRepository.save(fileReference);
    }

    public S3Object downloadFile(Long fileId) {
        FileReference fileReference = getFileById(fileId);
        return amazonS3.getObject(BUCKET_NAME, fileReference.getS3Key());
    }

}
