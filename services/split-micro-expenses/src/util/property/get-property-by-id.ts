import {DEFAULT_REQUEST_TIMEOUT_MS} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';
import axios, {AxiosError, isAxiosError} from 'axios';
import winston from 'winston';

import {PropertyDto} from '../../dtos';

export interface GetPropertyByIdResponse {
  status: number;
  property?: PropertyDto;
}

export type GetPropertyByIdFunction = (propertyId: string, headers: any) => Promise<GetPropertyByIdResponse>;

export const makeGetPropertyById = (logger: winston.Logger, propertyServiceBaseUrl: string): GetPropertyByIdFunction =>
  async (propertyId: string, headers: any) => {
    try {
      const url = `${propertyServiceBaseUrl}/id/${propertyId}`;
      logger.info(`Making GET request to: ${url}`);
      const {data, status} = await axios.get<PropertyDto>(
          url,
          {
            headers: {
              ...headers,
              'x-micro-communications': 'micro-expenses',
            },
            timeout: DEFAULT_REQUEST_TIMEOUT_MS,
          },
      );

      return (status === HttpStatus.OK) ? {status, property: data} : {status};
    } catch (err) {
      if (isAxiosError(err)) {
        logger.error(`Axios error occurred: ${err}`);
        const axiosError: AxiosError = err as AxiosError;
        if (axiosError.response && (axiosError.response.status === HttpStatus.FORBIDDEN || axiosError.status === HttpStatus.NOT_FOUND)) {
          return {status: axiosError.response.status};
        }
      } else {
        logger.error(`Unexpected error occurred: ${err}`);
      }
      return {status: HttpStatus.INTERNAL_SERVER_ERROR};
    }
  };
