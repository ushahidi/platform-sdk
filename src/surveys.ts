/* eslint-disable @typescript-eslint/camelcase */

import axios from 'axios';

export class Surveys {
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

    async getSurveys(id?:string):Promise<unknown> {
        try {
            const url = id ? `${this.backendUrl}/api/v4/surveys/${id}` : `${this.backendUrl}/api/v4/surveys/`;
            const config = this.token ? {
                headers: {"Authorization": `Bearer ${this.token}`}
            } : {}
            const response = await axios.get(url, config);
            return response.data.result || response.data.results;
        }
        catch(err) {
            return err;
        }
    }


    async saveSurvey(survey:{id?:string}):Promise<unknown> {
        const method = survey.id ? 'put' : 'post';
        const url = survey.id ? `${this.backendUrl}/api/v4/surveys/${survey.id}` : `${this.backendUrl}/api/v4/surveys/`;
            const res = await axios({
                method: method,
                url: url,
                headers:{
                    "Authorization": `Bearer ${this.token}`
                },
                data: survey
        });
        return res;
    }

    async deleteSurvey(id:string):Promise<unknown> {
            const res = await axios({
                method: 'delete',
                url: `${this.backendUrl}/api/v4/surveys/${id}`,
                headers:{
                    "Authorization": `Bearer ${this.token}`
                }
        });
        return res;
    }
}
