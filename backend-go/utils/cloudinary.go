package utils

import (
	"context"
	"errors"
	"log"
	"mime/multipart"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

var CLD *cloudinary.Cloudinary

func InitCloudinary() {
	var err error
	CLD, err = cloudinary.NewFromParams("dscuqiqmz","529466734581338", "3ZwurKW9fi_YqHWSj7WNnRnxexI")
	if err != nil {
		log.Fatal("Cloudinary init error:", err)
	}
}

func UploadImageToCloudinary(folderName string, file multipart.File) (string,error) {
	// ensure cloudinary is initialized
	if CLD == nil {
		return "", errors.New("cloudinary is not initialized")
	}

	resp, err := CLD.Upload.Upload(context.Background(), file, uploader.UploadParams{
		Folder: folderName,
	}) 
	if err != nil {
		return "", err
	}
	return resp.SecureURL, nil
}

func MoveImage(currentFolder, newFolder, imageName string) (string,error) {
	// ensure cloudinary is initialized
	if CLD == nil {
		return "", errors.New("cloudinary is not initialized")
	}

	oldPublicID := currentFolder + "/" + imageName
	newPublicID := newFolder + "/" + imageName

	resp, err := CLD.Upload.Rename(context.Background(), uploader.RenameParams{
		FromPublicID: oldPublicID,
		ToPublicID: newPublicID,
	})
	if err != nil {
		return "", err
	}

	return resp.SecureURL, nil
}

func DeleteImage(publicID string) (bool,error) {
	// ensure cloudinary is initialized
	if CLD == nil {
		return false, errors.New("cloudinary is not initialized")
	}

	resp, err := CLD.Upload.Destroy(context.Background(), uploader.DestroyParams{
		PublicID: publicID,
	})
	if err != nil {
		return false, err
	}

	//Cloudinary returns "deleted" if the image was successfully removed
	if resp.Result == "ok" || resp.Result == "not_found" {
		return resp.Result == "ok", nil
	}

	// if unknown response
	return false, errors.New("unexpected response from cloudinary")
}

func ExtractPublicID(imageURL string) (string) {
	parts := strings.Split(imageURL, "/upload/")
	if len(parts) < 2 {
		return ""
	}

	//Remove the version part
	pathParts := strings.SplitN(parts[1], "/", 2)
	if len(pathParts) < 2 {
		return ""
	}

	// retrun the extracted publicID (folder/filename)
	return pathParts[1][:len(pathParts[1])-4] // remove ".jpg" or other extensions
}