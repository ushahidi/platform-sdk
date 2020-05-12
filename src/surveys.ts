/* eslint-disable @typescript-eslint/camelcase */

import axios from 'axios';

export class Surveys {
    backendUrl:string;
    token:string;

    constructor (backendUrl:string, token:string) {
        this.backendUrl = backendUrl;
        this.token = token;
    }

    setToken(token?:string) {
        this.token = token;
    }

    async getSurveys(id?:string):Promise<unknown> {
        try {
            const url = id ? `${this.backendUrl}/api/v4/surveys/${id}` : `${this.backendUrl}/api/v4/surveys/`;
            const response = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${this.token}`
                }
            });

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
}