import { storage } from "@/appwrite";

export const getUrl = async (image: string) => {

  const parsedImage = JSON.parse(image)

  const url = storage.getFilePreview(parsedImage.bucketId, parsedImage.fileId)

  return url;

}