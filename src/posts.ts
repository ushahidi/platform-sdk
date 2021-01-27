/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios';

export class Posts {
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

  async findPost(id: string, only?: [], hydrate?: []): Promise<unknown> {
    try {
      let url = this.makeUrl(only, hydrate, `${this.backendUrl}/api/v5/posts/${id}`);
      const config = this.token
          ? {
            headers: { Authorization: `Bearer ${this.token}` },
          }
          : {};
      return await axios.get(url, config);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getPosts(only?: [], hydrate?: []): Promise<unknown> {
    try {
      let url = this.makeUrl(only, hydrate,`${this.backendUrl}/api/v5/posts/`);
      const config = this.token
        ? {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        : {};
      return await axios.get(url, config);
    } catch (err) {
      throw new Error(err);
    }
  }


  async getSurveys(id?: string, only?: [], hydrate?: []): Promise<unknown> {
    try {
      let url = id
          ? `${this.backendUrl}/api/v5/surveys/${id}`
          : `${this.backendUrl}/api/v5/surveys/`;
      let _only = this.getOnly(only);
      let _hydrate = this.getHydrate(hydrate)
      let params = this.getParams([_only, _hydrate]);
      if (params) {
        url = `${url}?${params}`;
      }
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

  async patchPost(post: { id: string }): Promise<unknown> {
    if (!post.id) {
      throw new Error("A PATCH request requires a Post Id");
    }
    if (!this.token) {
      throw new Error("A PATCH request requires an Authorization token");
    }

    const method = 'patch';
    const url = `${this.backendUrl}/api/v5/posts/${post.id}`;
    let headers = {
      Authorization: `Bearer ${this.token}`
    };

    return await axios({
      method: method,
      url: url,
      data: post,
      headers
    });
  }

  async savePost(post: { id?: string }): Promise<unknown> {
    const method = post.id ? 'put' : 'post';
    const url = post.id
      ? `${this.backendUrl}/api/v5/posts/${post.id}`
      : `${this.backendUrl}/api/v5/posts/`;
    let headers = {};
    /**
     * This lets the client not worry about tokens
     * because the SDK knows how to fallback if it needs to
     */
    if (this.token) {
      headers = {
        Authorization: `Bearer ${this.token}`,
      };
    }
    return await axios({
      method: method,
      url: url,
      data: post,
      headers
    });
  }


  /**
   * TODO: DISCUSSION NEEDED on semantics of bulk patch
   * @param bulk
   */
  async bulkPatch(items: [ {id: string } ]): Promise<unknown> {
    const method = 'post';
    const url = `${this.backendUrl}/api/v5/posts/bulk`;
    if (!this.token) {
      throw new Error("A PATCH request requires an Authorization token");
    }
    let headers = {
      Authorization: `Bearer ${this.token}`
    };
    return await axios({
      method: method,
      url: url,
      data: { operation: 'patch', items: items },
      headers
    });
  }

  /**
   * TODO: DISCUSSION NEEDED on semantics of bulk patch used on deletes
   * We are well outside of REST design here. DELETE bodys are often dropped, and PATCH may be the more reliable
   * of the operations when it comes to bulk actions, because we can specify the action with an approach similar to
   * the one used in JSON Patch. Needs more thought on stabilizing the API design before public rather than
   * platclient-only usage is encouraged
   * @param bulk
   */
  async bulkDelete(items: [ {id: string } ]): Promise<unknown> {
    const method = 'post';
    const url = `${this.backendUrl}/api/v5/posts/bulk`;
    if (!this.token) {
      throw new Error("A PATCH request requires an Authorization token");
    }
    let headers = {
      Authorization: `Bearer ${this.token}`
    };
    return await axios({
      method: method,
      url: url,
      data: { operation: 'delete', items: items },
      headers
    });
  }

  async deletePost(id: string): Promise<unknown> {
    const res = await axios({
      method: 'delete',
      url: `${this.backendUrl}/api/v5/posts/${id}`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return res;
  }

}
