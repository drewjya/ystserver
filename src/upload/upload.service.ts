import { Injectable } from '@nestjs/common';
import { ExcelTherapist, convertToTherapist } from 'src/config/excel.config';
import * as xlsx from 'xlsx';

@Injectable()
export class UploadService {
  async processData(filePath: string) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData: ExcelTherapist[] = xlsx.utils.sheet_to_json(worksheet);

    // Return the JSON data
    console.log(convertToTherapist(jsonData), "Data");

    return jsonData;


  }
}
