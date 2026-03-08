import vision from "@google-cloud/vision";
import fs from "fs";

// Create client (uses GOOGLE_APPLICATION_CREDENTIALS)
const client = new vision.ImageAnnotatorClient();

async function runOCR() {
  const fileName = "./qim.png";

  const [result] = await client.textDetection(fileName);
  const detections = result.textAnnotations;

  console.log("Extracted Text:");
  console.log(detections[0]?.description || "No text found");
}

runOCR();
