import {Categories} from '../src/categories';
import axios from 'axios';
jest.mock('axios');

const ushahidiCategories = new Categories('http://api.test.com', 'token');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Categories-constructor', () => {
    it('should set token if it is provided', () => {
        const testCategoriesClass = new Categories('http://api.test.com', 'token');
        expect(testCategoriesClass.token).toEqual('token');
    });
    it('token should be undefined if it is not provided', () => {
        const testCategoriesClass = new Categories('http://api.test.com');
        expect(testCategoriesClass.token).toBeUndefined();
    });
});

describe('getCategories-function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return all categories',  async () => {
        const data = [{id: 2}, {id:3}];
        mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{results:data}}));
        await expect(ushahidiCategories.getCategories()).resolves.toEqual(data);
    });
    it('should return one survey',  async () => {
        const data = {id: 1};
        mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{result:data}}));
        await expect(ushahidiCategories.getCategories('1')).resolves.toEqual(data);
        expect(mockedAxios.get).toBeCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith('http://api.test.com/api/v4/categories/1', {headers: { 'Authorization': 'Bearer token' }});
        });

        it('should not use token if not set',  async () => {
            const categoryWithoutToken = new Categories('http://api.test.com');
            const data = {id: 1};
            mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{result:data}}));
            await expect(categoryWithoutToken.getCategories('1')).resolves.toEqual(data);
            expect(mockedAxios.get).toBeCalledWith('http://api.test.com/api/v4/categories/1', {});
        });

        it('returns an error if something goes wrong', async () => {
            const Error = 'network error';
            mockedAxios.get.mockRejectedValue(Error);
            const returnValue = await ushahidiCategories.getCategories('1');
            expect(returnValue).toEqual(Error);
        });
    });