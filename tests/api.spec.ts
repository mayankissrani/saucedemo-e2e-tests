import { test, expect } from '@playwright/test';

const BASE_API = 'https://bookcart.azurewebsites.net/api';

test.describe('API Validation – BookCart Backend', () => {
  test.describe('Books API', () => {
    test('GET /api/Book should return a list of books', async ({ request }) => {
      const response = await request.get(`${BASE_API}/Book`);

      expect(response.status()).toBe(200);

      const books = await response.json();
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
    });

    test('each book should have required fields', async ({ request }) => {
      const response = await request.get(`${BASE_API}/Book`);
      expect(response.status()).toBe(200);

      const books = await response.json();
      const firstBook = books[0];

      expect(firstBook).toHaveProperty('bookId');
      expect(firstBook).toHaveProperty('title');
      expect(firstBook).toHaveProperty('author');
      expect(firstBook).toHaveProperty('price');
      expect(firstBook).toHaveProperty('category');
    });

    test('GET /api/Book/:id should return a single book', async ({ request }) => {
      // First get all books to find a valid ID
      const listResponse = await request.get(`${BASE_API}/Book`);
      expect(listResponse.status()).toBe(200);
      const books = await listResponse.json();
      expect(books.length).toBeGreaterThan(0);

      const bookId = books[0].bookId;

      // Fetch the specific book
      const bookResponse = await request.get(`${BASE_API}/Book/${bookId}`);
      expect(bookResponse.status()).toBe(200);

      const book = await bookResponse.json();
      expect(book.bookId).toBe(bookId);
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('author');
      expect(book).toHaveProperty('price');
    });

    test('GET /api/Book/:id with non-existent ID should return 404', async ({ request }) => {
      const response = await request.get(`${BASE_API}/Book/999999`);
      expect(response.status()).toBe(404);
    });

    test('book price should be a positive number', async ({ request }) => {
      const response = await request.get(`${BASE_API}/Book`);
      const books = await response.json();

      for (const book of books.slice(0, 5)) {
        expect(typeof book.price).toBe('number');
        expect(book.price).toBeGreaterThan(0);
      }
    });
  });

  test.describe('User / Auth API', () => {
    test('POST /api/User/login with valid credentials should return 200', async ({ request }) => {
      const response = await request.post(`${BASE_API}/User/login`, {
        data: {
          userLogin: 'admin',
          password: 'admin',
        },
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      // Response should contain a token or user info
      expect(body).toBeTruthy();
    });

    test('POST /api/User/login with invalid credentials should return 400 or 401', async ({ request }) => {
      const response = await request.post(`${BASE_API}/User/login`, {
        data: {
          userLogin: 'nonexistent_xyz',
          password: 'wrongpassword',
        },
      });

      expect([400, 401, 404]).toContain(response.status());
    });

    test('POST /api/User/register with new user data should return 200 or 201', async ({ request }) => {
      const uniqueUsername = `apitest_${Date.now()}`;

      const response = await request.post(`${BASE_API}/User/register`, {
        data: {
          firstName: 'API',
          lastName: 'Test',
          username: uniqueUsername,
          password: 'ApiTest@1234',
          gender: 'Male',
        },
      });

      expect([200, 201]).toContain(response.status());
    });

    test('POST /api/User/register with duplicate username should fail', async ({ request }) => {
      const response = await request.post(`${BASE_API}/User/register`, {
        data: {
          firstName: 'Admin',
          lastName: 'User',
          username: 'admin',
          password: 'Admin@1234',
          gender: 'Male',
        },
      });

      expect([400, 409, 500]).toContain(response.status());
    });
  });

  test.describe('Shopping Cart API', () => {
    let authToken: string;

    test.beforeAll(async ({ request }) => {
      // Obtain an auth token via login
      const loginResponse = await request.post(`${BASE_API}/User/login`, {
        data: {
          userLogin: 'admin',
          password: 'admin',
        },
      });
      if (loginResponse.status() === 200) {
        const body = await loginResponse.json();
        authToken = body.token ?? body;
      }
    });

    test('GET /api/ShoppingCart should return cart for authenticated user', async ({ request }) => {
      if (!authToken) {
        test.skip();
        return;
      }

      const response = await request.get(`${BASE_API}/ShoppingCart`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect([200, 204]).toContain(response.status());
    });
  });
});
