/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios';

export class Posts {
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
    return await axios({
      method: method,
      url: url,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      data: post,
    });
  }
}
