import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosRequestConfig,
} from 'axios'

class ApiInstance {
  private axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (import.meta.env.MODE === 'development') {
      this.axios.defaults.baseURL = 'http://localhost:3000'
    }

    this.axios.defaults.timeout = 300000
    this.axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    this.axios.defaults.xsrfCookieName = 'csrftoken'

    this.axios.interceptors.request.use(function (req) {
      req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
      return req
    })
  }

  async get<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.get(endpoint, options)
    return response.data
  }

  async post<T>(
    endpoint: string,
    data: any,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.post(
      endpoint,
      data,
      options,
    )
    return response.data
  }

  async put<T>(
    endpoint: string,
    data: any,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.put(
      endpoint,
      data,
      options,
    )
    return response.data
  }

  async patch<T>(
    endpoint: string,
    data: any,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.patch(
      endpoint,
      data,
      options,
    )
    return response.data
  }

  async delete<T>(
    endpoint: string,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.delete(
      endpoint,
      options,
    )
    return response.data
  }
}

export const apiInstance = new ApiInstance()
