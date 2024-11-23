import fs from "fs";

import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
} from "node-thermal-printer";

const { PRINTER_HOST, PRINTER_PORT } = process.env;
const printer = new ThermalPrinter({
  interface: `tcp://${PRINTER_HOST}:${PRINTER_PORT}`,
  characterSet: CharacterSet.WPC1252,
  type: PrinterTypes.EPSON,
});

const logoBuffer = fs.readFileSync("./src/assets/logo.png");
const lineFeed = () =>
  JSON.parse(
    JSON.stringify([
      {
        text: "------------------------------------------------------",
        align: "CENTER",
        width: 1.15,
      },
    ])
  );

async function printPreReceipt(receiptData) {
  printer.setTypeFontB();
  printer.alignCenter();

  //? Print Header
  printer.printImageBuffer(logoBuffer);
  printer.bold(true);
  printer.println("เคเอสอาร์คาร์คลีน สาขาโลตัสสงขลา");
  printer.bold(false);
  printer.tableCustom([
    {
      text: "เปิดทุกวัน 08:30-18:30 น. ติดต่อ 065-4068840",
      width: 1.2,
      align: "CENTER",
    },
  ]);
  printer.tableCustom([
    {
      text: "ให้บริการล้างสีดูดฝุ่น เคลือบสี ขัดสี ฟอกเบาะ เคลือบแก้ว",
      width: 1.2,
      align: "CENTER",
    },
  ]);
  printer.println();
  printer.tableCustom(lineFeed());

  //? Print Sub Header
  const {
    billNo,
    customerPhone,
    receiveDate,
    licensePlate,
    carDetail,
    carSize,
    paymentStatus,
  } = receiptData.header;

  printer.alignLeft();
  printer.println(`เลขที่บิล: ${billNo}`);
  printer.println(`เบอร์โทรลูกค้า: ${customerPhone}`);
  printer.println(`เวลารับรถ: ${receiveDate} น.`);
  printer.println(`เวลาคืนรถ: -`);
  printer.println(`ป้ายทะเบียน: ${licensePlate}`);
  printer.println(`รายละเอียดรถ: ${carDetail}`);
  printer.println(`ขนาดรถ: ${carSize}`);
  printer.println(`การชำระเงิน: ${paymentStatus}`);
  printer.println();

  //? Print Body
  const { services, discount, total, serviceItems } = receiptData.body;

  printer.tableCustom([
    { text: "รายการ", align: "CENTER", width: 1, bold: true },
    { text: "ราคา", align: "CENTER", width: 0.2, bold: true },
  ]);
  printer.tableCustom(lineFeed());
  services.forEach((service, index) => {
    const { name, price } = service;
    printer.tableCustom([
      { text: `${index + 1}. ${name}`, align: "LEFT", width: 0.8 },
      { text: `${price}.-`, align: "RIGHT", width: 0.2 },
    ]);
  });
  printer.tableCustom(lineFeed());
  if (discount) {
    printer.tableCustom([
      { text: "ส่วนลด", align: "RIGHT", width: 0.8 },
      { text: `${discount}.-`, align: "RIGHT", width: 0.25 },
    ]);
  }
  printer.tableCustom([
    { text: "ยอดรวมสุทธิ", align: "RIGHT", width: 0.8, bold: true },
    { text: `${total}.-`, align: "RIGHT", width: 0.25, bold: true },
  ]);

  printer.println();
  printer.tableCustom(lineFeed());
  printer.println();

  //? Print Sub Body
  printer.alignCenter();
  printer.bold(true);
  printer.println("รายการบริการที่ดำเนินการวันนี้");
  printer.bold(false);
  printer.println(serviceItems.join(", "));

  printer.println();
  printer.tableCustom(lineFeed());
  printer.println();

  printer.tableCustom([
    {
      text: "กรุณานำใบรับรถมาด้วยเมื่อมารับรถ เพื่อความสะดวกในการตรวจสอบ",
      width: 1.3,
      align: "CENTER",
    },
  ]);
  printer.cut();
  await printer.execute();
}

async function printReceipt(receiptData) {
  printer.openCashDrawer();
  printer.setTypeFontB();
  printer.alignCenter();

  //? Print Header
  printer.printImageBuffer(logoBuffer);
  printer.bold(true);
  printer.println("เคเอสอาร์คาร์คลีน สาขาโลตัสสงขลา");
  printer.bold(false);
  printer.tableCustom([
    {
      text: "เปิดทุกวัน 08:30-18:30 น. ติดต่อ 065-4068840",
      width: 1.2,
      align: "CENTER",
    },
  ]);
  printer.tableCustom([
    {
      text: "ให้บริการล้างสีดูดฝุ่น เคลือบสี ขัดสี ฟอกเบาะ เคลือบแก้ว",
      width: 1.2,
      align: "CENTER",
    },
  ]);
  printer.println();
  printer.tableCustom(lineFeed());

  //? Print Sub Header
  const {
    billNo,
    customerPhone,
    receiveDate,
    returnDate,
    licensePlate,
    carDetail,
    carSize,
    paymentStatus,
  } = receiptData.header;

  printer.alignLeft();
  printer.println(`เลขที่บิล: ${billNo}`);
  printer.println(`เบอร์โทรลูกค้า: ${customerPhone}`);
  printer.println(`เวลารับรถ: ${receiveDate} น.`);
  printer.println(`เวลาคืนรถ: ${returnDate} น.`);
  printer.println(`ป้ายทะเบียน: ${licensePlate}`);
  printer.println(`รายละเอียดรถ: ${carDetail}`);
  printer.println(`ขนาดรถ: ${carSize}`);
  printer.println(`การชำระเงิน: ${paymentStatus}`);
  printer.println();

  //? Print Body
  const { services, discount, total, serviceItems, point } = receiptData.body;

  printer.tableCustom([
    { text: "รายการ", align: "CENTER", width: 1, bold: true },
    { text: "ราคา", align: "CENTER", width: 0.2, bold: true },
  ]);
  printer.tableCustom(lineFeed());
  services.forEach((service, index) => {
    const { name, price } = service;
    printer.tableCustom([
      { text: `${index + 1}. ${name}`, align: "LEFT", width: 0.8 },
      { text: `${price}.-`, align: "RIGHT", width: 0.2 },
    ]);
  });
  printer.tableCustom(lineFeed());
  if (discount) {
    printer.tableCustom([
      { text: "ส่วนลด", align: "RIGHT", width: 0.8 },
      { text: `${discount}.-`, align: "RIGHT", width: 0.25 },
    ]);
  }
  printer.tableCustom([
    { text: "ยอดรวมสุทธิ", align: "RIGHT", width: 0.8, bold: true },
    { text: `${total}.-`, align: "RIGHT", width: 0.25, bold: true },
  ]);

  printer.println();
  printer.tableCustom(lineFeed());
  printer.println();

  //? Print Sub Body
  printer.alignCenter();
  printer.bold(true);
  printer.println("รายการบริการที่ดำเนินการวันนี้");
  printer.bold(false);
  printer.println(serviceItems.join(", "));

  printer.println();
  printer.tableCustom(lineFeed());
  printer.println();

  //? Print Footer
  if (point) {
    printer.tableCustom([
      {
        text: `ได้รับแต้มสะสม: ${point} แต้ม`,
        width: 1.2,
        align: "CENTER",
        bold: true,
      },
    ]);
    printer.tableCustom([
      {
        text: "เมื่อสะสมครบ 2, 4, 6, 8, 10 แต้มจะได้รับสิทธิพิเศษ",
        width: 1.2,
        align: "CENTER",
      },
    ]);
    printer.println();
  }

  //? Print Sub Footer
  printer.printQR("https://lin.ee/bkrPE4i", { cellSize: 5 });
  printer.tableCustom([
    {
      text: "ตรวจสอบและใช้สิทธิพิเศษได้ที่ แอดไลน์: @ksrcarclean",
      width: 1.2,
      align: "CENTER",
    },
  ]);

  printer.println();
  printer.tableCustom(lineFeed());
  printer.println();

  //? Print Note
  printer.bold(true);
  printer.println("หมายเหตุ");
  printer.bold(false);
  printer.tableCustom([
    {
      text: "เมื่อท่านรับรถคืน กรุณาตรวจสอบความเรียบร้อยของรถและ",
      width: 1.3,
      align: "CENTER",
    },
  ]);
  printer.tableCustom([
    {
      text: "ทรัพย์สินภายในทันที หากพบความเสียหายหรือสิ่งของสูญหาย",
      width: 1.3,
      align: "CENTER",
    },
  ]);
  printer.tableCustom([
    {
      text: "โปรดแจ้งให้ทางร้านทราบก่อนออกจากศูนย์บริการ ทั้งนี้",
      width: 1.3,
      align: "CENTER",
    },
  ]);
  printer.tableCustom([
    {
      text: "ทางร้านขอสงวนสิทธิ์ในการรับผิดชอบกรณีที่ไม่ได้แจ้งในขณะนั้น",
      width: 1.3,
      align: "CENTER",
    },
  ]);
  printer.println();
  printer.tableCustom(lineFeed());
  printer.println();

  //? Print Thanks
  printer.println("ขอบคุณที่ใช้บริการ เคเอสอาร์คาร์คลีน");
  printer.cut();
  await printer.execute();
}

async function checkPrinterStatus() {
  try {
    const isConnected = await printer.isPrinterConnected();
    return isConnected;
  } catch (error) {
    console.error("Error checking printer status:", error);
    return false;
  }
}

export { printPreReceipt, printReceipt, checkPrinterStatus };
