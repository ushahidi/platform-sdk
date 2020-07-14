import {Categories} from '../src/categories';
import axios from 'axios';
jest.mock('axios');

const ushahidiCategories = new Categories('http://api.test.com', 'token', Date.parse("2080 06 06"));
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Categories-constructor', () => {
    it('should set token if it is provided', () => {
        const testCategoriesClass = new Categories('http://api.test.com', 'token', Date.parse("2080 06 06"));
        expect(testCategoriesClass.token).toEqual('token');
    });
    it('token should be null if it is not provided', () => {
        const testCategoriesClass = new Categories('http://api.test.com');
        expect(testCategoriesClass.token).toBeNull();
    });
});

describe('setToken-function', () => {
    it('should set the token', () => {
        expect(ushahidiCategories.token).toEqual('token');
        ushahidiCategories.setToken('new token', Date.parse("2080 06 06"));
        expect(ushahidiCategories.token).toEqual('new token');
        ushahidiCategories.setToken('token', Date.parse("2080 06 06"));
        expect(ushahidiCategories.token).toEqual('token');
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
    it('should return one category',  async () => {
        const data = {id: 1};
        mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{result:data}}));
        await expect(ushahidiCategories.getCategories('1')).resolves.toEqual(data);
        expect(mockedAxios.get).toBeCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith('http://api.test.com/api/v5/categories/1', {headers: { 'Authorization': 'Bearer token' }});
        });

        it('should not use token if not set',  async () => {
            const categoryWithoutToken = new Categories('http://api.test.com');
            const data = {id: 1};
            mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{result:data}}));
            await expect(categoryWithoutToken.getCategories('1')).resolves.toEqual(data);
            expect(mockedAxios.get).toBeCalledWith('http://api.test.com/api/v5/categories/1', {});
        });

        it('returns an error if something goes wrong', async () => {
            const Error = 'network error';
            mockedAxios.get.mockRejectedValue(Error);
            await expect(ushahidiCategories.getCategories('1')).rejects.toThrow('network error');

        });
    });

describe('saveCategory-function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should use post-method if no id is provided', async () => {
        const category = {id:null, name:'Test category'};
        await ushahidiCategories.saveCategory(category);
        expect(axios).toBeCalledWith({
            method: 'post',
            url: 'http://api.test.com/api/v5/categories/',
            headers: { 'Authorization': 'Bearer token' },
            data: category,
        });
    });

    it('should use put-method if id is provided', async () => {
        const category = {id:'1', name:'Test category'};
        await ushahidiCategories.saveCategory(category);
        expect(axios).toBeCalledWith({
            method: 'put',
            url: 'http://api.test.com/api/v5/categories/1',
            headers: { 'Authorization': 'Bearer token' },
            data: category,
        });
    });
});

describe('deleteCategories-function', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should use delete-method', async () => {
        await ushahidiCategories.deleteCategory('1');
        expect(axios).toBeCalledWith({
            method: 'delete',
            url: 'http://api.test.com/api/v5/categories/1',
            headers: { 'Authorization': 'Bearer token' }
        });
    });
});
