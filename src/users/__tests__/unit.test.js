const axios = require('axios');
const { getAuthenticatedUser } = require('../index');

jest.mock('axios');

describe('users unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthenticatedUser', () => {
    test('should call GET /me', async () => {
      const mockResponse = {
        status: 200,
        data: {
          user: {
            id: 12345678,
            username: 'test-user',
            email: 'test@example.com',
            fullName: 'Test User'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getAuthenticatedUser();

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/me'
        })
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.user).toHaveProperty('id');
    });
  });
});

