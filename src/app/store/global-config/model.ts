export enum StatusEnum {
    error = 'error',
    success = 'success',
    warning = 'warn'
  }

export interface Status {
    status: StatusEnum;
    message: string;
    reset?: boolean;
    params?: any;
  }
  
  