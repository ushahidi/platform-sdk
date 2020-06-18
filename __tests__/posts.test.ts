import {Posts} from '../src/posts';
import axios from 'axios';
jest.mock('axios');

const ushahidiPosts = new Posts('http://api.test.com', 'token');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Posts-constructor', () => {
    it('should set token if it is provided', () => {
        const testPostsClass = new Posts('http://api.test.com', 'token');
        expect(testPostsClass.token).toEqual('token');
    });
    it('token should be undefined if it is not provided', () => {
        const testPostsClass = new Posts('http://api.test.com');
        expect(testPostsClass.token).toBeUndefined();
    });
});

describe('setToken-function', () => {
    it('should set the token', () => {
        expect(ushahidiPosts.token).toEqual('token');
        ushahidiPosts.setToken('new token');
        expect(ushahidiPosts.token).toEqual('new token');
        ushahidiPosts.setToken('token');
        expect(ushahidiPosts.token).toEqual('token');
    });
});

describe('getPosts-function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all posts',  async () => {
        const data = [{id: 2}, {id:3}];
        mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{results:data}}));
        await expect(ushahidiPosts.getPosts()).resolves.toEqual(data);
    });
    it('should return one post',  async () => {
        const data = {id: 1};
        mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{result:data}}));
        await expect(ushahidiPosts.getPosts('1')).resolves.toEqual(data);
        expect(mockedAxios.get).toBeCalledTimes(1);
        expect(mockedAxios.get).toBeCalledWith('http://api.test.com/api/v4/posts/1', {headers: { 'Authorization': 'Bearer token' }});
        });

        it('should not use token if not set',  async () => {
            const postWithoutToken = new Posts('http://api.test.com');
            const data = {id: 1};
            mockedAxios.get.mockImplementationOnce(() => Promise.resolve({data:{result:data}}));
            await expect(postWithoutToken.getPosts('1')).resolves.toEqual(data);
            expect(mockedAxios.get).toBeCalledWith('http://api.test.com/api/v4/posts/1', {});
        });

        it('returns an error if something goes wrong', async () => {
            const Error = 'network error';
            mockedAxios.get.mockRejectedValue(Error);
            const returnValue = await ushahidiPosts.getPosts('1');
            expect(returnValue).toEqual(Error);
        });
    });

