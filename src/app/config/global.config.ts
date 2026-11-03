import { HttpErrorResponse } from '@angular/common/http';
import {StatusEnum,Status} from '../store/global-config/model';
import { SetStatus } from '../store/global-config/action';


export enum ExecMode {
  prod = 'prod',
  mock = 'mock',
}
/**
 * Global status handler
 */
export class GlobalConfig {
  private static errorMsg = 'Erreur de connection. Veuillez Contacter l\'administrateur';
  static setStatus(status: StatusEnum, localMessage?: string, error?: HttpErrorResponse| undefined) {
    console.log(error);

    const errorStatus = error?.status;
    const errorData = error?.error;
    if (localMessage) {
      return SetStatus({status: {status, message: localMessage}});
    } else {
      switch (errorStatus) {
        case 200:
          return SetStatus({status:{status: StatusEnum.success, message: 'Opération reussie !'}});
        case 404: {
          if (!errorData) {
            return SetStatus({status:{status, message: this.errorMsg}});
          } else if (errorData.message) {
            if (errorData.message.indexOf('available') !== 0) {
              // ici mon cas
              return SetStatus({status:{status, message: errorData.message}});
            } else {
              return SetStatus({status:{status, message: errorData.message}});
            }
          } else if (errorData instanceof ArrayBuffer) {
            const msg = this.returnMsgFromArrayBuffer(errorData);
            return SetStatus({status:{status, message: msg}});
          } else {
            return SetStatus({status:{status, message: this.errorMsg}});
          }
        }
        case 500:
          return SetStatus({status:{status, message: this.errorMsg}});
        default: {
          if (!errorData) {
            return SetStatus({status:{status, message: this.errorMsg}});
          } else if (errorData.message) {
            return SetStatus({status:{status, message: errorData.message}});
          } else if (errorData instanceof ArrayBuffer) {
            const msg = this.returnMsgFromArrayBuffer(errorData);
            return SetStatus({status:{status, message: msg}});
          } else {
            return SetStatus({status:{status, message: this.errorMsg}});
          }
        }
      }
    }
  }

  static getEndpoint(urlObj: any, execMode = ExecMode.prod): string {
    return urlObj[execMode];
  }

  static returnMsgFromArrayBuffer(buf: ArrayBuffer): string {
    let response;
    if ('TextDecoder' in window) {
      // Decode as UTF-8
      const dataView = new DataView(buf);
      const decoder = new TextDecoder('utf8');
      response = JSON.parse(decoder.decode(dataView));
    } else {
      // Fallback decode as ASCII
      const decodedString = String.fromCharCode.apply(null,  Array.from(new Uint8Array(buf)));
      response = JSON.parse(decodedString);
    }
    return response.message;
  }


}

