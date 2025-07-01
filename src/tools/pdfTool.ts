import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import JSZip from "jszip";

type Employee = {
    mst: string,
    fullname: string,
    gender: number,
    birthday: string,
    cccd: string,
    cccdDate: string,
    cccdAt: string,
    phone: string,
    address: string,
    work: string,
    workPlace: string
};
function getYearOfBirthday(birthday: string){
    let birthYear = "";
    if(birthday.includes("-")){
        const values = birthday.split("-");
        for(const s of values){
            if(s.length >= 4){
                birthYear = s;
                break;
            }
        }
    }
    else if(birthday.includes("/")){
        const values = birthday.split("/");
        for(const s of values){
            if(s.length >= 4){
                birthYear = s;
                break;
            }
        }
    }
    return parseInt(birthYear);
}
async function createPDFType1(
    pdf_data: ArrayBuffer,
    font_data: ArrayBuffer,
    ee: Employee
){
    const pdfDoc = await PDFDocument.load(pdf_data);
    pdfDoc.registerFontkit(fontkit);
    const font1 = await pdfDoc.embedFont(font_data);
    const page = pdfDoc.getPage(0);
    const color = rgb(1, 0, 0);
    page.drawText(ee.fullname, {
        x: 900,
        y: 663,
        size: 12,
        font: font1,
        color: color,
    });
    if(ee.gender == 1){
        page.drawText('x', {
            x: 835,
            y: 630,
            size: 14,
            font: font1,
            color: color,
        });
    }
    else{
        page.drawText('x', {
            x: 874,
            y: 630,
            size: 14,
            font: font1,
            color: color,
        });
    }
    const age = new Date().getFullYear() - getYearOfBirthday(ee.birthday);
    page.drawText(age.toString(), {
        x: 975,
        y: 631,
        size: 13,
        font: font1,
        color: color,
    });
    page.drawText(ee.mst, {
        x: 1085,
        y: 631,
        size: 13,
        font: font1,
        color: color,
    });
    page.drawText(ee.cccd, {
        x: 945,
        y: 603,
        size: 13,
        font: font1,
        color: color,
    });
    page.drawText(ee.cccdDate, {
        x: 805,
        y: 580,
        size: 13,
        font: font1,
        color: color,
    });
    page.drawText(ee.cccdAt, {
        x: 940,
        y: 580,
        size: 13,
        font: font1,
        color: color,
    });
    page.drawText(ee.phone, {
        x: 770,
        y: 530,
        size: 13,
        font: font1,
        color: color,
    });
    page.drawText(ee.address, {
        x: 740,
        y: 511,
        size: 13,
        font: font1,
        color: color,
    });
    page.drawText(ee.work, {
        x: 740,
        y: 490,
        size: 13,
        font: font1,
        color: color,
    });
    page.drawText(ee.workPlace, {
        x: 780,
        y: 471,
        size: 13,
        font: font1,
        color: color,
    });

    return await pdfDoc.save();
}
async function createPDFType2(
    pdf_data: ArrayBuffer,
    font_data: ArrayBuffer,
    ee: Employee
){
    const pdfDoc = await PDFDocument.load(pdf_data);
    pdfDoc.registerFontkit(fontkit);
    const font1 = await pdfDoc.embedFont(font_data);
    const page = pdfDoc.getPage(0);
    const color = rgb(1, 0, 0);
    page.drawText(ee.fullname, {
        x: 125,
        y: 567,
        size: 12,
        font: font1,
        color: color,
    });
    page.drawText(ee.gender == 1 ? "Nam" : "Nữ", {
        x: 445,
        y: 567,
        size: 12,
        font: font1,
        color: color,
    });
    page.drawText(ee.birthday, {
        x: 140,
        y: 545,
        size: 12,
        font: font1,
        color: color,
    });
    page.drawText(ee.mst, {
        x: 445,
        y: 545,
        size: 12,
        font: font1,
        color: color,
    });
    page.drawText(ee.work, {
        x: 215,
        y: 457,
        size: 12,
        font: font1,
        color: color,
    });
    page.drawText(ee.workPlace, {
        x: 225,
        y: 414,
        size: 12,
        font: font1,
        color: color,
    });

    return await pdfDoc.save();
}

async function createPDFs(
    pdf_data: ArrayBuffer,
    font_data: ArrayBuffer,
    ees: Employee[],
    createPDFTypeFunc: typeof createPDFType1 |  typeof createPDFType2
){
    const results_datas: ArrayBuffer[] = [];
    for(const ee of ees){
        results_datas.push(
            await createPDFTypeFunc(pdf_data, font_data, ee)
        );
    }
    return results_datas;
}

async function zipPdfs(
    ees: Employee[],
    datas: ArrayBuffer[]
){
    const zip = new JSZip();
    for(let i = 0; i < ees.length; i++){
        const ee = ees[i];
        const data = datas[i];
        zip.file(`${ee.mst}-${ee.fullname}.pdf`, data);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    return blob;
}

async function mergePdfs(
    datas: ArrayBuffer[]
){
    const mergedPdf = await PDFDocument.create();
    for(let i = 0; i < datas.length; i++){
        const data = datas[i];
        const pdf = await PDFDocument.load(data);
        const copyPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copyPages.forEach(page => { mergedPdf.addPage(page); });
    }
    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    return blob;
}

export { createPDFType1, createPDFType2, createPDFs, zipPdfs, mergePdfs }