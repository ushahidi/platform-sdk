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

  getOnly(only) {
    if (only) {
      return 'only=' + only.join(',');
    }
    return null;
  }
  getHydrate(hydrate) {
    if (hydrate) {
      return 'hydrate=' + hydrate.join(',');
    }
    return null;
  }

  getParams(params) {
    if (params.length === 0) {
      return '';
    }
    return encodeURI(params.concat('&'));
  }

  makeUrl(only, hydrate, url) {
    let _only = this.getOnly(only);
    let _hydrate = this.getHydrate(hydrate)
    let _params = [];
    if (_only) {
      _params.push(_only);
    }
    if (_hydrate) {
      _params.push(_hydrate)
    }
    let params = this.getParams(_params);
    if (params) {
      url = `${url}?${params}`;
    }
    return url;
  }
  async findSurvey(id: string, only?: [], hydrate?: []) : Promise<unknown> {
    try {
      const url = this.makeUrl(only, hydrate, `${this.backendUrl}/api/v5/surveys/${id}`);
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
  async getSurveys(only?: [], hydrate?: []): Promise<unknown> {
    try {
      const url = this.makeUrl(only, hydrate, `${this.backendUrl}/api/v5/surveys/`);

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
