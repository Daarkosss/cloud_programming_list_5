package com.example.lab4.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Getter
@Setter
public class FileReference {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;
    private String fileName;
    private String fileLink;
    private String s3Key;

}
