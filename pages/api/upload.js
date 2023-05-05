import multiparty from "multiparty";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);
  const form = new multiparty.Form();
  const getRandNum = (min=1000, max=10000) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const {fields, files} = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({fields, files});
    });
  });
  console.log(files);

  const client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })

  const links = [];

  for(const file of files.file){
    const extension = file.originalFilename.split('.').pop();
    const newFileName = getRandNum().toString() + '.' + extension;

    await client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: newFileName,
      Body: fs.readFileSync(file.path),
      ACL: "public-read",
      ContentType: mime.lookup(file.path),
    }));

    const link = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${newFileName}`;
    links.push(link);

  }
  
  res.json({links});
}

export const config = {
  api: {
    bodyParser: false,
  },
};
