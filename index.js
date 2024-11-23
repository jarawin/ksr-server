import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  checkPrinterStatus,
  printPreReceipt,
  printReceipt,
} from "./src/printer.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(json());

app.post("/print-receipt", async (req, res) => {
  try {
    const { receiptData } = req.body;
    await printReceipt(receiptData);
    res.status(200).send("Print job sent successfully.");
  } catch (error) {
    console.error("Error printing:", error);
    res.status(500).send("Printing failed.");
  }
});

app.post("/print-pre-receipt", async (req, res) => {
  try {
    const { receiptData } = req.body;
    await printPreReceipt(receiptData);
    res.status(200).send("Print job sent successfully.");
  } catch (error) {
    console.error("Error printing:", error);
    res.status(500).send("Printing failed.");
  }
});

app.get("/status", async (req, res) => {
  try {
    const isConnected = await checkPrinterStatus();
    res.status(200).send({ connected: isConnected });
  } catch (error) {
    console.error("Error checking printer status:", error);
    res.status(500).send("Error checking printer status.");
  }
});

app.get("/", (req, res) => {
  const { VERSION } = process.env;
  res.send(`Server running version ${VERSION}`);
});

const { PORT } = process.env;
app.listen(PORT || 3000, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
