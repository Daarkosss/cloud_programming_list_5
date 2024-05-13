provider "aws" {
  region = "us-east-1" 
}

resource "aws_s3_bucket" "moj_bucket" {
  bucket = "files-app-bucket-v1"
}
