import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// Configure S3 client with Sevalla credentials
const s3 = new S3Client({
  region: "asia-southeast1", // Singapore region per your Sevalla DB
  endpoint: "https://portal-assets.s3.sevalla.app", // replace with your Sevalla bucket endpoint
  credentials: {
    accessKeyId: process.env.SEVALLA_ACCESS_KEY!,
    secretAccessKey: process.env.SEVALLA_SECRET_KEY!,
  },
});

// Upload function
export async function uploadImage(filePath: string): Promise<string> {
  const fileStream = fs.createReadStream(filePath);
  const fileKey = `${uuidv4()}-${filePath.split("/").pop()}`;

  const uploadParams = {
    Bucket: "portal-assets",
    Key: fileKey,
    Body: fileStream,
    ContentType: "image/jpeg", // adjust if PNG
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return `https://portal-assets.s3.sevalla.app/${fileKey}`;
}
