/* eslint-disable @typescript-eslint/camelcase */

import axios from 'axios';

export class Surveys {
  backendUrl: string;
  token: string;

  constructor(backendUrl: string, token?: string, expires?: number) {
    this.backendUrl = backendUrl;
    this.setToken(token, expires);
  }

  static fieldHasTranslations = (field, lang) => {
    return field.translations[lang] && field.translations[lang].options && Object.values(field.translations[lang].options).length > 0;
  }

  static fieldCanHaveOptions = (field) => {
    return field.input === 'checkbox' || field.input === 'radio' || field.input === 'select';
  }

  static areOptionsUnique(options: []) {
    // converting to Set would remove duplicates,so if size matches original we are good
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
    return new Set(options).size === options.length;
  }
  static hasEmptyOptions(options: []) {
    // check against duplicate or empty options
    return options.filter(i => i === '' || i === null).length > 0;
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
