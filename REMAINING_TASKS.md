# BooksTrack Backend - Remaining Test Tasks

**Current Status:** Phase 2 Complete (193/240+ tests)
**Last Updated:** November 13, 2025
**Target Completion:** November 20, 2025

---

## Phase 3: Handler Tests (55+ tests)

### Overview
Test API route handlers with focus on request validation, response formatting, and error handling.

### Files to Create
- `tests/handlers/search-handlers.test.js` - Search endpoint tests
- `tests/handlers/batch-enrichment.test.js` - Batch launch tests
- `tests/handlers/scan-handlers.test.js` - Photo scan tests
- `tests/handlers/csv-import.test.js` - CSV import tests
- `tests/handlers/token-refresh.test.js` - Token refresh tests

### Test Categories

#### 1. Request Validation (12 tests)
```
✓ Missing required parameters → 400 (isbn, q, jobId)
✓ Invalid parameter format → 400 (non-numeric jobId)
✓ Request body exceeds size limit → 413 (>100KB for CSV)
✓ Invalid JSON in request body → 400
✓ Missing Content-Type header → 400
✓ Unsupported Content-Type → 415
✓ Invalid query string encoding → 400
✓ Missing Authorization header → 401
✓ Expired token → 401
✓ Rate limit exceeded → 429
✓ Malformed base64 (CSV upload) → 400
✓ SQL injection attempt (query parameter) → 400
```

#### 2. Route Dispatch (8 tests)
```
✓ GET /v1/search/isbn routes to isbnSearch handler
✓ GET /v1/search/title routes to titleSearch handler
✓ GET /v1/search/author routes to authorSearch handler
✓ POST /v1/batch-enrichment routes to launchBatch handler
✓ POST /v1/bookshelf/scan routes to scanBookshelf handler
✓ POST /v1/books/import/csv routes to importCSV handler
✓ POST /api/token/refresh routes to refreshToken handler
✓ OPTIONS * returns CORS headers
```

#### 3. Response Format (10 tests)
```
✓ Search response includes canonical book object
✓ Batch response includes jobId and WebSocket URL
✓ Scan response includes photo processing status
✓ CSV response includes import summary
✓ Error response includes error code and message
✓ Response includes Cache-Control headers
✓ Response includes X-Request-ID header
✓ Paginated response includes pagination metadata
✓ Envelope format matches canonical structure
✓ Timestamp is ISO-8601 format
```

#### 4. Error Responses (12 tests)
```
✓ Provider timeout (>5s) returns 504 Gateway Timeout
✓ Rate limit (429) returns retry-after header
✓ Missing API key returns 500 (not 401)
✓ Invalid ISBN returns 400 (not 404)
✓ No results returns 200 with empty array (not 404)
✓ Gemini API error returns 500
✓ KV storage error returns 500
✓ DO storage error returns 500
✓ WebSocket upgrade error returns 426 (missing Upgrade header)
✓ Token refresh validation error returns 400
✓ CSV file too large returns 413
✓ CSV parsing error returns 400
```

#### 5. Concurrency (8 tests)
```
✓ Concurrent searches don't block each other
✓ Same jobId for concurrent requests returns 409 (conflict)
✓ Multiple batch launches process independently
✓ Token refresh race condition handled (only one succeeds)
✓ CSV upload and search concurrent requests OK
✓ Rate limit counts correctly across concurrent requests
✓ Cache key uniqueness for concurrent enrichment
✓ DO single-threading prevents state corruption
```

#### 6. Feature Flags (5 tests)
```
✓ ENABLE_UNIFIED_ENVELOPE=true uses new format
✓ ENABLE_UNIFIED_ENVELOPE=false uses legacy format
✓ Feature flag toggle doesn't affect endpoint behavior
✓ Feature flag works across all endpoints
✓ Feature flag default behavior (false)
```

### Success Criteria
- ✅ All 55+ handler tests passing
- ✅ 70%+ code coverage for handler files
- ✅ <100ms average handler execution time
- ✅ No flaky tests (all deterministic)

---

## Phase 4: E2E & Error Tests (73+ tests)

### Overview
End-to-end workflow testing, error scenario coverage, edge cases, and performance validation.

### Files to Create
- `tests/e2e/workflows.test.js` - Full workflow tests
- `tests/e2e/error-scenarios.test.js` - Error handling tests
- `tests/e2e/edge-cases.test.js` - Edge case tests
- `tests/e2e/performance.test.js` - Performance tests

### Test Categories

#### 1. Full Workflow Tests (20 tests)

**Search → Enrich → Cache Flow**
```
✓ Search by ISBN → enriched book → cached
✓ Search by title → multiple results → user selects one
✓ Search failure → fallback to next provider
✓ All providers fail → meaningful error message
✓ Cache hit → served without provider call
✓ Cache miss → provider called and cached
✓ Stale cache → refresh from provider
✓ Partial enrichment → supplement from secondary provider
✓ Author deduplication in results
✓ Cover image sourced from ISBNdb
```

**Batch Enrichment Flow**
```
✓ Launch batch → WebSocket connection → progress updates → completion
✓ 5-book batch → all enriched → results returned
✓ Mixed success/failure → partial results + error summary
✓ Batch cancel mid-processing → cleanup + close WebSocket
✓ Batch timeout (30 min) → auto-cancel + cleanup
✓ DO eviction → state persisted → recovery on reconnect
✓ Token refresh during batch → new token + continue
✓ Progress updates every book → 0% → 100%
✓ Concurrent batches → isolation (different jobIds)
```

**Photo Scan Flow**
```
✓ Upload 3 photos → Gemini scan → book extraction → enrichment
✓ One photo fails → others continue
✓ Scan cancel → processed photos kept, pending cancelled
```

#### 2. Error Scenarios (25 tests)

**Provider Errors**
```
✓ Google Books timeout → fallback to OpenLibrary
✓ Google Books 429 rate limit → queue and retry
✓ Google Books 401 invalid key → error logged, fallback
✓ OpenLibrary timeout → fallback to ISBNdb
✓ All providers timeout → meaningful error
✓ Malformed JSON from provider → retry next provider
✓ Empty response from all providers → no data error
✓ Provider partially down (50% failure) → success if 1 succeeds
```

**Authentication Errors**
```
✓ Expired token → 401 + error message
✓ Invalid token → 401
✓ Missing token → 401
✓ Token refresh 401 → force re-login
✓ Concurrent token refresh → second request waits for first
✓ Token exactly at expiration boundary → rejected
```

**Storage Errors**
```
✓ KV get fails → provider called
✓ KV put fails → continue without caching
✓ DO storage get fails → error handling
✓ DO storage put fails → partial state loss handling
```

**Rate Limiting Errors**
```
✓ Rate limit exceeded → 429 + retry-after header
✓ Rate limit for specific endpoint → other endpoints OK
✓ Rate limit per-IP enforced → different IPs independent
```

**CSV Import Errors**
```
✓ CSV >10MB → 413 Payload Too Large
✓ Malformed CSV (bad encoding) → parse error handling
✓ CSV with invalid rows → skip bad rows, import valid ones
✓ CSV import 404 → file not found handling
```

#### 3. Edge Cases (15 tests)

**Boundary Conditions**
```
✓ ISBN-10 conversion to ISBN-13
✓ Very long title (500+ chars) → truncated appropriately
✓ Non-ASCII characters in title/author → handled correctly
✓ Very large author list (100+ authors) → all stored
✓ Cover image URL with special characters → encoded properly
```

**Concurrency Edge Cases**
```
✓ 100 concurrent searches same ISBN → deduped, 1 fetch
✓ Token refresh while processing batch → new token used
✓ DO eviction during batch → state recovered
✓ WebSocket disconnect/reconnect → progress preserved
✓ Rapid cancel/resume → proper state transitions
```

**Cache Edge Cases**
```
✓ Cache expires during batch → refresh triggered
✓ Cache corruption detected → fallback to provider
✓ Cache key collision handling
✓ Very large cached object (>1MB) → stored correctly
✓ Cache stampede (many requests same miss) → deduped
```

#### 4. Performance Tests (8 tests)

**Latency Targets**
```
✓ Search <500ms (P95)
✓ Cached response <50ms (P95)
✓ Batch enrichment 5 books <30s
✓ Photo scan <60s for 3 photos
✓ CSV import 1000 rows <120s
✓ Token refresh <100ms
✓ WebSocket message delivery <100ms
✓ DO single-hop latency <50ms
```

#### 5. Security Tests (5 tests)

**Input Validation**
```
✓ XSS attempt in title search → escaped/rejected
✓ SQL injection in query → handled as literal string
✓ Command injection in file upload → rejected
✓ Path traversal in CSV filename → blocked
✓ CSRF token validation → enforced
```

### Success Criteria
- ✅ All 73+ E2E tests passing
- ✅ 75%+ overall code coverage
- ✅ All error scenarios handled gracefully
- ✅ Performance targets met (latency <target)
- ✅ No data corruption in concurrent scenarios
- ✅ 100% deterministic (no flaky tests)

---

## Implementation Checklist

### Phase 3 (Target: Nov 15)
- [ ] Create tests/handlers/ directory
- [ ] Implement search-handlers.test.js (12 tests)
- [ ] Implement batch-enrichment.test.js (8 tests)
- [ ] Implement scan-handlers.test.js (10 tests)
- [ ] Implement csv-import.test.js (12 tests)
- [ ] Implement token-refresh.test.js (13 tests)
- [ ] Verify 70%+ handler coverage
- [ ] All Phase 3 tests passing
- [ ] Update TEST_PLAN.md with Phase 3 results

### Phase 4 (Target: Nov 17)
- [ ] Create tests/e2e/ directory
- [ ] Implement workflows.test.js (20 tests)
- [ ] Implement error-scenarios.test.js (25 tests)
- [ ] Implement edge-cases.test.js (15 tests)
- [ ] Implement performance.test.js (8 tests)
- [ ] Implement security.test.js (5 tests)
- [ ] Verify 75%+ overall coverage
- [ ] All Phase 4 tests passing
- [ ] Finalize TEST_PLAN.md

### Final Verification (Target: Nov 20)
- [ ] All 240+ tests passing
- [ ] Coverage report: 75%+ critical paths
- [ ] Coverage report: 70%+ handlers
- [ ] Coverage report: 65%+ overall
- [ ] Test execution time <5 minutes
- [ ] No flaky tests (runs consistently)
- [ ] Documentation complete
- [ ] Ready for production deployment

---

## Notes

### Phase 3 Notes
- Focus on **handler isolation** - test handlers independently
- Use **mock services** - don't call real external APIs
- Test **both success and error paths** for each handler
- Validate **response envelope format** matches canonical structure
- Check **rate limiting integration** works correctly

### Phase 4 Notes
- Use **real handler calls** (not mocked) for E2E tests
- **Minimal mocking** - only mock external APIs and slow operations
- Test **actual code paths** through the system
- Validate **database/storage interactions** (KV, DO storage)
- Measure **actual performance** on test data

---

**Prepared by:** Claude Code
**Status:** Ready for Phase 3 Implementation
**Questions:** See TEST_PLAN.md for comprehensive test strategy
