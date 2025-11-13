/**
 * Mock Gemini API Responses
 *
 * Fixtures for Gemini 2.0 Flash API testing
 * Used by: tests/services/ai-scanner.test.js
 */

/**
 * Mock Gemini Image Analysis Response
 * Returns detected books from bookshelf image
 */
export const mockGeminiImageAnalysisResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: JSON.stringify([
              {
                isbn: '9780439708180',
                title: 'Harry Potter and the Philosopher\'s Stone',
                author: 'J.K. Rowling',
                confidence: 0.95
              },
              {
                isbn: '9780439064873',
                title: 'Harry Potter and the Chamber of Secrets',
                author: 'J.K. Rowling',
                confidence: 0.92
              },
              {
                isbn: '9780439136365',
                title: 'Harry Potter and the Prisoner of Azkaban',
                author: 'J.K. Rowling',
                confidence: 0.88
              }
            ])
          }
        ],
        role: 'model'
      },
      finishReason: 'STOP',
      safetyRatings: [
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          probability: 'NEGLIGIBLE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          probability: 'NEGLIGIBLE'
        }
      ]
    }
  ],
  usageMetadata: {
    promptTokenCount: 1200,
    candidatesTokenCount: 350,
    totalTokenCount: 1550,
    cachedTokenCount: 0
  },
  modelVersion: 'gemini-2.0-flash-exp'
}

/**
 * Mock Gemini CSV Parsing Response
 * Returns parsed book data from CSV
 */
export const mockGeminiCSVParsingResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: JSON.stringify([
              {
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                isbn: '9780743273565',
                year: 1925
              },
              {
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                isbn: '9780061120084',
                year: 1960
              },
              {
                title: '1984',
                author: 'George Orwell',
                isbn: '9780451524935',
                year: 1949
              }
            ])
          }
        ],
        role: 'model'
      },
      finishReason: 'STOP'
    }
  ],
  usageMetadata: {
    promptTokenCount: 2000,
    candidatesTokenCount: 400,
    totalTokenCount: 2400
  }
}

/**
 * Mock Gemini Text Generation Response
 * For generic text completion
 */
export const mockGeminiTextResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: 'This is a generated response from Gemini.'
          }
        ],
        role: 'model'
      },
      finishReason: 'STOP'
    }
  ],
  usageMetadata: {
    promptTokenCount: 100,
    candidatesTokenCount: 50,
    totalTokenCount: 150
  }
}

/**
 * Mock Gemini Error Response - Unsafe Content
 */
export const mockGeminiUnsafeContentError = {
  error: {
    code: 400,
    message: 'The request was blocked due to safety concerns',
    status: 'INVALID_ARGUMENT'
  }
}

/**
 * Mock Gemini Error Response - Rate Limited
 */
export const mockGeminiRateLimitError = {
  error: {
    code: 429,
    message: 'Resource exhausted',
    status: 'RESOURCE_EXHAUSTED'
  }
}

/**
 * Mock Gemini Error Response - Context Length Exceeded
 */
export const mockGeminiContextExceededError = {
  error: {
    code: 400,
    message: 'Context length exceeded',
    status: 'INVALID_ARGUMENT'
  }
}

/**
 * Mock Gemini Error Response - Invalid API Key
 */
export const mockGeminiAuthError = {
  error: {
    code: 401,
    message: 'Unauthorized: invalid API key',
    status: 'UNAUTHENTICATED'
  }
}

/**
 * Mock cached Gemini response (with cache metadata)
 * For testing prompt caching behavior
 */
export const mockGeminiCachedResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: 'Cached response from Gemini'
          }
        ],
        role: 'model'
      },
      finishReason: 'STOP'
    }
  ],
  usageMetadata: {
    promptTokenCount: 100,
    candidatesTokenCount: 50,
    totalTokenCount: 150,
    cachedTokenCount: 50, // Cached tokens from previous calls
    cacheCreationInputTokens: 100,
    cacheReadInputTokens: 50
  }
}

/**
 * Helper: Create Gemini API request mock
 */
export function createMockGeminiRequest(content = {}) {
  return {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: content.text || 'Analyze this image'
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      }
    ],
    systemInstruction: {
      parts: [
        {
          text: 'You are a helpful assistant'
        }
      ]
    },
    ...content
  }
}

/**
 * Helper: Create Gemini streaming response
 * For testing streaming endpoints
 */
export function createMockGeminiStreamingChunk(text, finishReason = null) {
  return {
    candidates: [
      {
        content: {
          parts: [
            {
              text
            }
          ],
          role: 'model'
        },
        finishReason
      }
    ]
  }
}

/**
 * Helper: Validate Gemini response structure
 */
export function validateGeminiResponse(response) {
  return (
    response &&
    response.candidates &&
    Array.isArray(response.candidates) &&
    response.candidates.length > 0 &&
    response.candidates[0].content &&
    response.candidates[0].content.parts &&
    Array.isArray(response.candidates[0].content.parts)
  )
}

/**
 * Helper: Extract text from Gemini response
 */
export function extractGeminiText(response) {
  if (!validateGeminiResponse(response)) {
    throw new Error('Invalid Gemini response structure')
  }

  const parts = response.candidates[0].content.parts
  return parts.map(part => part.text).join('')
}

/**
 * Helper: Extract usage metadata from Gemini response
 */
export function extractGeminiUsage(response) {
  return response.usageMetadata || {
    promptTokenCount: 0,
    candidatesTokenCount: 0,
    totalTokenCount: 0,
    cachedTokenCount: 0
  }
}
