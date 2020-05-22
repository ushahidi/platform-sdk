/* eslint-disable @typescript-eslint/camelcase */

import axios from 'axios';

export class Categories {
    backendUrl:string;
    token:string;

    constructor (backendUrl:string, token?:string) {
        this.backendUrl = backendUrl;
        this.token = token;
    }

    setToken(token?:string):object {
        this.token = token;
        return this;
    }

    async getCategories(query:object, id?:string):Promise<unknown> {
        try {
            const url = id ? `${this.backendUrl}/api/v4/categories/${id}` : `${this.backendUrl}/api/v4/categories/`;
            const config = this.token ? {
                headers: {"Authorization": `Bearer ${this.token}`},
                data: query
            } : {}
            const response = await axios.get(url, config);
            return response.data.result || response.data.results;
        }
        catch(err) {
            return err;
        }
    }


    async saveCategory(category:{id?:string}):Promise<unknown> {
        const method = category.id ? 'put' : 'post';
        const url = category.id ? `${this.backendUrl}/api/v4/categories/${category.id}` : `${this.backendUrl}/api/v4/categories/`;
        try {    
            const res = await axios({
                    method: method,
                    url: url,
                    headers:{
                        "Authorization": `Bearer ${this.token}`
                    },
                    data: category
            });
            return res;
        } catch(err) {
            return err;
        }
    }

    async deleteCategory(id:string):Promise<unknown> {
            const res = await axios({
                method: 'delete',
                url: `${this.backendUrl}/api/v4/categories/${id}`,
                headers:{
                    "Authorization": `Bearer ${this.token}`
                }
        });
        return res;
    }
}