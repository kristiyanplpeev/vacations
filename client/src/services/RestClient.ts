import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { injectable } from "inversify";

import { applicationJSON, errMessage } from "common/constants";
import { IAuthService, IRestClient } from "inversify/interfaces";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleResponse = (response: AxiosResponse): any => {
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleError = (err: AxiosError): any => {
  if (err.response) {
    console.log(err.response);
    throw new Error(err.response.data.message);
  } else {
    throw new Error(errMessage);
  }
};

@injectable()
export class RestClient implements IRestClient {
  private authService = myContainer.get<IAuthService>(TYPES.Auth);
  private readonly baseUrl = "http://localhost:5000/";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getConfig = (method: Method, urlParams: string, data?: any, headers?: any, withCredentials?: any) => {
    return {
      method,
      url: this.baseUrl + urlParams,
      data,
      withCredentials,
      headers: Object.assign(
        {
          "Content-Type": applicationJSON,
          // eslint-disable-next-line prettier/prettier
          Authorization: `Bearer ${this.authService.getToken()}`,
        },
        headers,
      ),
    };
  };

  async get<T>(url: string, input?: AxiosRequestConfig): Promise<T> {
    return await this.do("GET", url, input);
  }

  async post<T>(url: string, input?: AxiosRequestConfig): Promise<T> {
    return await this.do("POST", url, input);
  }

  async delete<T>(url: string, input?: AxiosRequestConfig): Promise<T> {
    return await this.do("DELETE", url, input);
  }

  async patch<T>(url: string, input?: AxiosRequestConfig): Promise<T> {
    return await this.do("PATCH", url, input);
  }

  async put<T>(url: string, input?: AxiosRequestConfig): Promise<T> {
    return await this.do("PUT", url, input);
  }

  private async do<T>(method: Method, urlParams: string, input?: AxiosRequestConfig): Promise<T> {
    const result = await axios
      .request(this.getConfig(method, urlParams, input?.data, input?.headers, input?.withCredentials))
      .then(handleResponse, handleError);
    return result as T;
  }
}
