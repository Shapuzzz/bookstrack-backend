/**
 * Mock API Provider Responses
 *
 * Common response fixtures for testing provider integrations
 * Used by: tests/integration/external-apis.test.js
 */

/**
 * Mock Google Books API Response
 * Successful title search result
 */
export const mockGoogleBooksSearchResponse = {
  kind: 'books#volumes',
  totalItems: 2,
  items: [
    {
      kind: 'books#volume',
      id: 'test-google-id-1',
      etag: 'test-etag',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/test-google-id-1',
      volumeInfo: {
        title: 'Harry Potter and the Philosopher\'s Stone',
        authors: ['J.K. Rowling'],
        publisher: 'Bloomsbury',
        publishedDate: '1998-01-01',
        description: 'A young wizard discovers his magical powers...',
        industryIdentifiers: [
          { type: 'ISBN_10', identifier: '0439708180' },
          { type: 'ISBN_13', identifier: '9780439708180' }
        ],
        readingModes: { text: true, image: true },
        pageCount: 309,
        printType: 'BOOK',
        categories: ['Fiction', 'Fantasy'],
        averageRating: 4.5,
        ratingsCount: 10000,
        language: 'en',
        imageLinks: {
          smallThumbnail: 'https://example.com/small.jpg',
          thumbnail: 'https://example.com/thumb.jpg'
        }
      }
    },
    {
      kind: 'books#volume',
      id: 'test-google-id-2',
      volumeInfo: {
        title: 'Harry Potter and the Chamber of Secrets',
        authors: ['J.K. Rowling'],
        publisher: 'Bloomsbury',
        publishedDate: '1999-01-01',
        industryIdentifiers: [
          { type: 'ISBN_13', identifier: '9780439064873' }
        ]
      }
    }
  ]
}

/**
 * Mock Google Books API Response - Single Volume (by ID)
 */
export const mockGoogleBooksVolumeResponse = {
  kind: 'books#volume',
  id: 'test-volume-id',
  volumeInfo: {
    title: 'Harry Potter and the Philosopher\'s Stone',
    authors: ['J.K. Rowling'],
    publisher: 'Bloomsbury',
    publishedDate: '1998-01-01',
    description: 'A young wizard discovers his magical powers...',
    industryIdentifiers: [
      { type: 'ISBN_10', identifier: '0439708180' },
      { type: 'ISBN_13', identifier: '9780439708180' }
    ],
    pageCount: 309,
    language: 'en',
    imageLinks: {
      thumbnail: 'https://example.com/thumb.jpg'
    }
  }
}

/**
 * Mock Google Books API - Empty Response (No Results)
 */
export const mockGoogleBooksEmptyResponse = {
  kind: 'books#volumes',
  totalItems: 0,
  items: []
}

/**
 * Mock OpenLibrary API Response
 * Successful search result
 */
export const mockOpenLibrarySearchResponse = {
  docs: [
    {
      key: '/works/OL45833W',
      title: 'Harry Potter and the Philosopher\'s Stone',
      author_name: ['J.K. Rowling'],
      first_publish_year: 1998,
      isbn: ['9780439708180', '0439708180'],
      cover_id: 3629234,
      subject: ['Fantasy', 'Magic', 'Wizards'],
      publisher: ['Bloomsbury'],
      language: ['eng']
    }
  ],
  numFound: 1,
  start: 0
}

/**
 * Mock OpenLibrary Work Response
 * Used for detailed work lookup
 */
export const mockOpenLibraryWorkResponse = {
  type: '/type/work',
  key: '/works/OL45833W',
  title: 'Harry Potter and the Philosopher\'s Stone',
  description: 'A young wizard discovers his magical powers...',
  created: {
    type: '/type/datetime',
    value: '2008-04-03T03:28:50.625462'
  },
  last_modified: {
    type: '/type/datetime',
    value: '2023-01-15T10:30:00.000000'
  },
  authors: [
    {
      author: {
        key: '/authors/OL34184A',
        name: 'J.K. Rowling'
      },
      type: '/type/author_role'
    }
  ],
  subjects: ['Fantasy', 'Magic', 'Wizards', 'Schools'],
  first_publish_date: '1998-01-01',
  number_of_editions: 45
}

/**
 * Mock OpenLibrary Edition Response
 */
export const mockOpenLibraryEditionResponse = {
  type: '/type/edition',
  key: '/books/OL7353617M',
  title: 'Harry Potter and the Philosopher\'s Stone',
  isbn_10: ['0439708180'],
  isbn_13: ['9780439708180'],
  publish_date: '1998-01-01',
  publishers: ['Bloomsbury'],
  number_of_pages: 309,
  covers: [3629234],
  works: [{ key: '/works/OL45833W' }],
  authors: [
    {
      name: 'J.K. Rowling',
      key: '/authors/OL34184A'
    }
  ]
}

/**
 * Mock OpenLibrary Author Response
 */
export const mockOpenLibraryAuthorResponse = {
  type: '/type/author',
  key: '/authors/OL34184A',
  name: 'J.K. Rowling',
  birth_date: '1965-07-31',
  death_date: '',
  alternate_names: ['Joanne Rowling', 'Joanne Kathleen Rowling'],
  bio: 'British author, best known for the Harry Potter series',
  website: 'https://www.jkrowling.com',
  wikipedia: 'J. K. Rowling'
}

/**
 * Mock ISBNdb API Response
 * Cover image search
 */
export const mockISBNdbResponse = {
  data: [
    {
      isbn: '9780439708180',
      title: 'Harry Potter and the Philosopher\'s Stone',
      image: 'https://images.isbndb.com/covers/22/80/9780439708180.jpg',
      authors: ['J.K. Rowling'],
      publisher: 'Bloomsbury'
    }
  ]
}

/**
 * Mock Gemini API Response
 * Image analysis result
 */
export const mockGeminiResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: '[{"isbn": "9780439708180", "title": "Harry Potter and the Philosopher\'s Stone", "author": "J.K. Rowling", "confidence": 0.95}, {"isbn": "9780439064873", "title": "Harry Potter and the Chamber of Secrets", "author": "J.K. Rowling", "confidence": 0.92}]'
          }
        ],
        role: 'model'
      },
      finishReason: 'STOP',
      safetyRatings: []
    }
  ],
  usageMetadata: {
    promptTokenCount: 1500,
    candidatesTokenCount: 500,
    totalTokenCount: 2000
  },
  modelVersion: 'gemini-2.0-flash-exp'
}

/**
 * Mock API Error Response - 429 Rate Limited
 */
export const mockRateLimitError = {
  error: {
    code: 429,
    message: 'Too Many Requests',
    status: 'RESOURCE_EXHAUSTED'
  }
}

/**
 * Mock API Error Response - 401 Unauthorized
 */
export const mockUnauthorizedError = {
  error: {
    code: 401,
    message: 'Invalid API key'
  }
}

/**
 * Mock API Error Response - 500 Server Error
 */
export const mockServerError = {
  error: {
    code: 500,
    message: 'Internal Server Error'
  }
}

/**
 * Helper: Create mock fetch response
 * @param {*} data - Response body
 * @param {number} status - HTTP status code
 * @param {Record<string, string>} headers - Response headers
 */
export function createMockFetchResponse(data, status = 200, headers = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: new Map(Object.entries(headers)),
    json: async () => data,
    text: async () => JSON.stringify(data),
    blob: async () => new Blob([JSON.stringify(data)])
  }
}

/**
 * Helper: Create mock fetch timeout error
 */
export function createMockFetchTimeout() {
  return new Error('Fetch timeout after 5000ms')
}

/**
 * Helper: Create mock fetch connection error
 */
export function createMockFetchConnectionError() {
  return new Error('Connection refused')
}
