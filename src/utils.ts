import axios from 'axios';

export const getLanguages = async (backendURL:string):Promise<unknown> => {
    try {
        const response = await axios.get(`${backendURL}/api/v4/languages`);
        console.log(response)
        return response.data;
    } catch(err) {
        return err;
    }
}