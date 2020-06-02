import {getLanguages} from '../src/utils';
import axios from 'axios';
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getLanguages function', () => {
    it('should return a list of languages',  async () =>{
        const languages = [{"code":"et-EE","name":"Estonian (Estonia)"},{"code":"fo","name":"Faroese"}];
        const response = {"data":languages};
        mockedAxios.get.mockImplementationOnce(() => Promise.resolve(response));
        await expect(getLanguages('http://api.test.com')).resolves.toEqual(languages);
    });
    it('should return an error if something goes wrong', async () => {
        const Error = 'network error';
        mockedAxios.get.mockRejectedValue(Error);
        const returnValue = await getLanguages('http://api.test.com');
        expect(returnValue).toEqual(Error);
    });
});