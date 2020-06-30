/* eslint-disable @typescript-eslint/camelcase */

import axios from 'axios';

export class Categories {
  backendUrl: string;
  token: string;

  constructor(backendUrl: string, token?: string) {
    this.backendUrl = backendUrl;
    this.token = token;
  }

  setToken(token?: string): object {
    this.token = token;
    return this;
  }

  async getCategories(id?: string): Promise<unknown> {
    try {
      const url = id
        ? `${this.backendUrl}/api/v5/categories/${id}`
        : `${this.backendUrl}/api/v5/categories/`;
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

  async saveCategory(category: { id?: string }): Promise<unknown> {
    const method = category.id ? 'put' : 'post';
    const url = category.id
      ? `${this.backendUrl}/api/v5/categories/${category.id}`
      : `${this.backendUrl}/api/v5/categories/`;
    const res = await axios({
      method: method,
      url: url,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      data: category,
    });
    return res;
  }

  async deleteCategory(id: string): Promise<unknown> {
    const res = await axios({
      method: 'delete',
      url: `${this.backendUrl}/api/v5/categories/${id}`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return res;
  }
}
