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

  async findPost(id: string): Promise<unknown> {
    try {
      const url = `${this.backendUrl}/api/v5/posts/${id}`;
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

  async getPosts(): Promise<unknown> {
    try {
      const url = `${this.backendUrl}/api/v5/posts/`;
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
