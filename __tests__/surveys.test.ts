import {Surveys} from '../src/surveys';
import axios from 'axios';
jest.mock('axios');

const ushahidiSurveys = new Surveys('http://api.test.com', 'token');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Surveys-constructor', () => {
    it('should set token if it is provided', () => {
        const testSurveyClass = new Surveys('http://api.test.com', 'token');
        expect(testSurveyClass.token).toEqual('token');
    })
    it('token should be undefined if it is not provided', () => {
        const testSurveyClass = new Surveys('http://api.test.com');
        expect(testSurveyClass.token).toBeUndefined();
    })
});
describe('setToken-function', () => {
    it('should set token if it is provided', () => {
        const testSurveyClass = new Surveys('http://api.test.com');
        expect(testSurveyClass.token).toBeUndefined();
        testSurveyClass.setToken('test token')
        expect(testSurveyClass.token).toEqual('test token');
    })
});
describe('getSurveys-function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return all surveys',  async () =>{
        const data = [{id: 2}, {id:3}];
        mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{results:data}}));
        await expect(ushahidiSurveys.getSurveys()).resolves.toEqual(data);
    });
    it('should return one survey',  async () => {
        const data = {id: 1};
        mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{result:data}}));
        await expect(ushahidiSurveys.getSurveys('1')).resolves.toEqual(data);
        expect(mockedAxios.get).toBeCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith('http://api.test.com/api/v5/surveys/1', {headers: { 'Authorization': 'Bearer token' }});
        });

        it('should not use token if not set',  async () => {
            const surveyWithoutToken = new Surveys('http://api.test.com');
            const data = {id: 1};
            mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{result:data}}));
            await expect(surveyWithoutToken.getSurveys('1')).resolves.toEqual(data);
            expect(mockedAxios.get).toBeCalledWith('http://api.test.com/api/v5/surveys/1', {});
        });

        it('returns an error if something goes wrong', async () => {
            const Error = 'network error';
            mockedAxios.get.mockRejectedValue(Error);
            await expect(ushahidiSurveys.getSurveys('1')).rejects.toThrow('network error');
        });
    });
    describe('saveSurvey-function', ()=>{
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should use post-method if no id is provided', async () => {
            const survey = {id:null, name:'Test survey'};
            await ushahidiSurveys.saveSurvey(survey);
            expect(axios).toBeCalledWith({
                method: 'post',
                url: 'http://api.test.com/api/v5/surveys/',
                headers: { 'Authorization': 'Bearer token' },
                data: survey,
            });
        });

        it('should use put-method if id is provided', async () => {
            const survey = {id:'1', name:'Test survey'};
            await ushahidiSurveys.saveSurvey(survey);
            expect(axios).toBeCalledWith({
                method: 'put',
                url: 'http://api.test.com/api/v5/surveys/1',
                headers: { 'Authorization': 'Bearer token' },
                data: survey,
            });
        });
    });

    describe('deleteSurvey-function', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should use delete-method', async () => {
            await ushahidiSurveys.deleteSurvey('5');
            expect(axios).toBeCalledWith({
                method: 'delete',
                url: 'http://api.test.com/api/v5/surveys/5',
                headers: { 'Authorization': 'Bearer token' }
            });
        });
    });
