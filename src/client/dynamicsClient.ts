import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { ReserveFieldServicesSlotRequest } from '../types/slots/reserveSlotRequest';
import { BookFieldServiceSlotRequest } from '../types/slots/bookSlotRequest';

@injectable()
export class DynamicsClient {

  private axios: AxiosInstance

  constructor () {
    const axiosRequestConfig: AxiosRequestConfig = {
      baseURL: 'https://prod-04.uksouth.logic.azure.com:443/workflows/da128b45877348f392bc4486554906b9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Edfo65xhPQHA34kyzddSDk1MfBw2UyiOgqMysc5nwFw',
      timeout: 12000,
    }

    this.axios = axios.create(axiosRequestConfig)
  }

  public reserveSlot(reserveSlotRequest: ReserveFieldServicesSlotRequest): Promise<void> {
    return this.httpHandler<void>(() => this.axios.post('', reserveSlotRequest))
  }

  public bookSlot(bookSlotRequest: BookFieldServiceSlotRequest): Promise<void> {
    return this.httpHandler<void>(() => this.axios.post('', bookSlotRequest))
  }

  private async httpHandler<T>(request: () => AxiosPromise<T>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await request()
      console.log('axios response', response)
      if (response.data) {
        return response.data
      }
    } catch (err) {
      return this.handleError(err)
    }
  }

  private handleError(err) {
    console.error('Error - Dynamics Client', err)
    err.status = err.response ? err.response.status : StatusCodes.INTERNAL_SERVER_ERROR
    return Promise.reject(err)
  }
}
