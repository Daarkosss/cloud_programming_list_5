package com.example.lab5.controller;

import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.example.lab5.entity.FileReference;
import com.example.lab5.entity.UpdateFileRequest;
import com.example.lab5.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @DeleteMapping("/{fileId}")
    public ResponseEntity<FileReference> deleteFile(@PathVariable Long fileId) {
        FileReference deletedFile = fileService.deleteFile(fileId);
        if (deletedFile != null) {
            return ResponseEntity.ok(deletedFile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FileReference> updateFile(@PathVariable Long id, @RequestBody UpdateFileRequest updateFileRequest) {
        return ResponseEntity.ok(fileService.updateFile(id, updateFileRequest.getFileName()));
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
        FileReference fileReference = fileService.getFileById(fileId);
        S3Object file = fileService.downloadFile(fileId);
        S3ObjectInputStream fileStream = file.getObjectContent();
        
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(file.getObjectMetadata().getContentType()))
                .header("Content-Disposition", "attachment; filename=\"" + fileReference.getFileName() + "\"")
                .body(new InputStreamResource(fileStream));
    }

}
