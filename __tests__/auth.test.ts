import {getAuthToken} from '../src/auth';
import axios from 'axios';
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getAuthToken function', () => {
    it('should return a token if correct username and password is used',  async () =>{
        const response = {"data":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJ"}};
        const returnValue = {token: response.data.access_token};
        mockedAxios.post.mockImplementationOnce(() => Promise.resolve(response));
        await expect(getAuthToken('test@example.com', 'test', 'http://api.test.com')).resolves.toEqual(returnValue);
    });    
});