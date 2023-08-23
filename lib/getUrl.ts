import { storage } from "@/appwrite";

export const getUrl = async (image: any) => {

  const parsedImage = JSON.parse(image)

  const url = storage.getFilePreview(parsedImage.bucketId, parsedImage.fileId)

  return url;

}