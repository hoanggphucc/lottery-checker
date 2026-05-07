export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    result: T[];
  }

  interface IUser {
    _id: string;
    name: string;
    email: string;
    dob: string;
    role: string;
  }

  interface IProvince {
    id: number;
    regionId: number;
    code: string;
    name: string;
    schedule: any;
    region: {
      id: number;
      code: string;
      name: string;
      description: string;
    };
  }

  interface ICheckTicketDto {
    province: string;
    date: string;
    ticketNumber;
  }

  interface ICheckTicketResult {
    prize: string;
    number: string;
  }
}
