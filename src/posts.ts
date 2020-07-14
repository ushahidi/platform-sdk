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

  async getPosts(id?: string): Promise<unknown> {
    try {
      const url = id
        ? `${this.backendUrl}/api/v5/posts/${id}`
        : `${this.backendUrl}/api/v5/posts/`;
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
}
