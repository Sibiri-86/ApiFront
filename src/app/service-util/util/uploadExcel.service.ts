import { Injectable } from "@angular/core";
import { GlobalSer } from "./global";
import { formatDate } from "@angular/common";
import * as FileSaver from "file-saver";

@Injectable({ providedIn: 'root' })
export class  UploadExcelService {
    constructor() {}

    
    public saveAsExcelFile(buffer: any, baseFileName: string): void {
        const data: Blob = new Blob([buffer], {type: GlobalSer.EXCEL_TYPE});
        FileSaver.saveAs(data, baseFileName + '_' + this.getDateFormat(new Date())  + GlobalSer.EXCEL_EXTENSION);
      }
    
      private getDateFormat(date: Date): string {
        return formatDate(date, 'yyyyMMdd_HHmmss', 'en-US');
      }
}