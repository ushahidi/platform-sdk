/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios';

export class Config {
  backendUrl: string;
  token: string;

  constructor(backendUrl: string) {
    this.backendUrl = backendUrl;
  }

  async getConfig(id?: string): Promise<unknown> {
      const url = id
        ? `${this.backendUrl}/api/v3/config/${id}`
        : `${this.backendUrl}/api/v3/config/`;

      const response = await axios.get(url);
      return response.data;
  }
}
