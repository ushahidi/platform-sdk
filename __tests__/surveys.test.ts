import {Surveys} from '../src/surveys';
import axios from 'axios';
jest.mock('axios');

const ushahidiSurveys = new Surveys('http://api.test.com', 'token');
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getSurveys-function', () => {
    it('should return all surveys',  async () =>{
        const data = [{id: 2}, {id:3}];
        mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{results:data}}));
        await expect(ushahidiSurveys.getSurveys()).resolves.toEqual(data);

    });
    it('should return one survey',  async () => {
        const data = {id: 2};
        mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{result:data}}));
        await expect(ushahidiSurveys.getSurveys('1')).resolves.toEqual(data);
    });
});