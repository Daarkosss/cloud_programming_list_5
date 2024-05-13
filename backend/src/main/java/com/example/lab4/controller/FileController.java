package com.example.lab4.controller;

import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.example.lab4.entity.FileReference;
import com.example.lab4.service.FileService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileReference> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("fileName") String fileName
    ) {
        try {
            return ResponseEntity.ok(fileService.uploadFile(fileName, file));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<FileReference> deleteFile(@RequestParam("fileId") Long fileId) {
        return ResponseEntity.ok(fileService.deleteFile(fileId));
    }

    @PostMapping("/update")
    public ResponseEntity<FileReference> updateFile(@RequestParam("fileId") Long fileId, @RequestParam("fileName") String fileName) {
        return ResponseEntity.ok(fileService.updateFile(fileId, fileName));

    }

    @GetMapping("/all")
    public ResponseEntity<List<FileReference>> getAllFiles() {
        try {
            List<FileReference> files = fileService.getAllFiles();
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam("fileId") Long fileId) {
        S3Object file = fileService.downloadFile(fileId);
        S3ObjectInputStream fileStream = file.getObjectContent();
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(file.getObjectMetadata().getContentType()))
                .body(new InputStreamResource(fileStream));
    }

}
