/* eslint-disable @typescript-eslint/camelcase */

import axios from 'axios';

export class Surveys {
  backendUrl: string;
  token: string;

  constructor(backendUrl: string, token?: string, expires?: number) {
    this.backendUrl = backendUrl;
    this.setToken(token, expires);
  }

  setToken(token?: string, expires?: number): object {
    this.token = null;
    if (expires >= Math.floor(Date.now() / 1000)) {
      this.token = token;
    }
    return this;
  }

  async getSurveys(id?: string): Promise<unknown> {
    try {
      const url = id
        ? `${this.backendUrl}/api/v5/surveys/${id}`
        : `${this.backendUrl}/api/v5/surveys/`;
      const config = this.token
        ? {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        : {};
      const response = await axios.get(url, config);
      return response.data.result || response.data.results;
    } catch (err) {
      throw new Error(err);
    }
  }

  async saveSurvey(survey: { id?: string }): Promise<unknown> {
    const method = survey.id ? 'put' : 'post';
    const url = survey.id
      ? `${this.backendUrl}/api/v5/surveys/${survey.id}`
      : `${this.backendUrl}/api/v5/surveys/`;
    const res = await axios({
      method: method,
      url: url,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      data: survey,
    });
    return res;
  }

  async deleteSurvey(id: string): Promise<unknown> {
    const res = await axios({
      method: 'delete',
      url: `${this.backendUrl}/api/v5/surveys/${id}`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return res;
  }
}
