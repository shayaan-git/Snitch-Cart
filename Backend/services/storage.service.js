import ImageKit from "@imagekit/nodejs";
import { configs } from "../src/config/config.js";

const client = new ImageKit({
  privateKey: configs.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadFile({ buffer, fileName, folder = "elevate" }) {
  const result = await client.files.upload({
    file: await ImageKit.toFile(buffer),
    fileName,
    folder,
  });

  return result;
}
