# APIs Required for Central Park News

**For the developer:** Our site will fetch from these APIs to display data. Please provide these endpoints.

---

## API Summary Table

| Use Case | Method | API Call | What We Fetch |
|----------|--------|----------|---------------|
| **Top Stories + Home hero** (homepage) | GET | `/api/articles?limit=7&isFeatured=true&type=news` | 7 featured articles, newest first. We use item[0] for hero, items[0–6] for Top Stories sidebar |
| **Latest news** (footer carousel) | GET | `/api/articles?limit=12&type=news` | 12 latest news articles, ordered by `createdAt` desc |
| **All news** (news listing page + pagination) | GET | `/api/articles/pagination?page=1&itemsPerPage=9&type=news` | Paginated list of all news |
| **Single article** (article page) | GET | `/api/article/[slug]?type=news` | One article by slug |
| **Search** | GET | `/api/search?q=term&limit=20` | Search results |
| **Newsletter subscribe** | POST | `/api/subscribe` | Body: `{ "email": "..." }` |
| **Newsletter unsubscribe** | POST | `/api/unsubscribe` | Body: `{ "email": "...", "token": "..." }` |
| **Contact form** | POST | `/api/send-mail` | Body: `{ "name": "...", "email": "...", "message": "..." }` |

---

## 1. Get Articles (with limit & filters) — Top Stories, Home Hero

**Request**
```
GET /api/articles?limit=7&isFeatured=true&type=news
```

**Query params**
| Param      | Type    | Default   | Description                              |
|------------|---------|-----------|------------------------------------------|
| limit      | number  | 50        | Max number of articles to return         |
| isFeatured | boolean | (none)    | `true` = featured only, `false` = non-featured |
| type       | string  | news      | `news` or `article`                      |
| category   | string  | (none)    | Filter by category name                  |
| status     | string  | published | `published` or `draft`                    |

**Order:** `createdAt` desc (newest first)

**Response (200)**
```json
[
  {
    "id": "string",
    "title": "string",
    "content": "string",
    "imageURL": "string",
    "authorName": "string",
    "titleSlug": "string",
    "mobileURL": "string",
    "category": "string",
    "createdAt": "string",
    "publishDate": { "seconds": number, "nanoseconds": number },
    "type": "newsletter"
  }
]
```

**Order:** `createdAt` desc (newest first)

**Used for:** Top Stories (limit=7, isFeatured=true), Home hero (limit=1, isFeatured=true), Latest news (limit=12, type=news)

---

## 2. Get Paginated Articles (News Listing Page)

**Request**
```
GET /api/articles/pagination?page=1&itemsPerPage=9&type=news
```

**Query params**
| Param        | Type   | Default | Description              |
|--------------|--------|---------|--------------------------|
| page         | number | 1       | Page number              |
| itemsPerPage | number | 9       | Items per page           |
| type         | string | news    | `news` or `article`      |

**Response (200)**
```json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "imageURL": "string",
      "authorName": "string",
      "titleSlug": "string",
      "category_name": "string",
      "createdAt": "string or timestamp",
      "type": "news"
    }
  ],
  "totalPages": 10,
  "totalItems": 90,
  "hasNextPage": true,
  "hasPrevPage": false,
  "currentPage": 1
}
```

**Used for:** News page listing, pagination

---

## 3. Get Single Article by Slug

**Request**
```
GET /api/article/[slug]?type=news
```

**Params**
| Param | Type   | Description          |
|-------|--------|----------------------|
| slug  | string | URL slug of article  |
| type  | string | `news` or `article` (query param) |

**Response (200)**
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "excerpt": "string",
  "imageURL": "string",
  "titleSlug": "string",
  "authorName": "string",
  "authorImage": "string",
  "position": "string",
  "formattedDate": "string",
  "category": "string",
  "createdAt": "string",
  "socialImageUrls": { "mobile": { "url": "string" }, "facebook": { "url": "string" } },
  "tags": ["string"]
}
```

**Response (404):** `null` or error object

**Used for:** Single article page, related article fetch

---

## 4. Get Latest News

**Request**
```
GET /api/articles?limit=12&type=news
```

**Query params**
| Param  | Type   | Default | Description     |
|--------|--------|---------|-----------------|
| limit  | number | 12      | Number of items |
| type   | string | news    | `news` or `article` |

**Order:** `createdAt` desc (newest first)

**Response (200)**
```json
[
  {
    "id": "string",
    "title": "string",
    "content": "string",
    "imageURL": "string",
    "authorName": "string",
    "titleSlug": "string",
    "category": "string",
    "formattedDate": "string",
    "publishDate": "string",
    "createdAt": "string",
    "type": "news"
  }
]
```

**Used for:** Latest news carousel in footer

---

## 5. Search Articles

**Request**
```
GET /api/search?q=search+term&limit=20
```

**Query params**
| Param | Type   | Default | Description      |
|-------|--------|---------|------------------|
| q     | string | required| Search term      |
| limit | number | 20      | Max results      |

**Response (200)**
```json
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "imageURL": "string",
      "authorName": "string",
      "createdAt": "string",
      "titleSlug": "string",
      "type": "news",
      "category_name": "string"
    }
  ],
  "total": 5,
  "searchTerm": "search term",
  "totalFound": 5
}
```

**Used for:** Search bar / search results

---

## 6. Newsletter Subscribe

**Request**
```
POST /api/subscribe
Content-Type: application/json

{ "email": "user@example.com" }
```

**Response (200)**
```json
{ "message": "Email sent successfully" }
```

**Response (400)**
```json
{ "message": "Email already exists" }
```

**Used for:** Newsletter signup form in header/banner

---

## 7. Newsletter Unsubscribe

**Request**
```
POST /api/unsubscribe
Content-Type: application/json

{ "email": "user@example.com", "token": "unsubscribe-token" }
```

**Response (200)**
```json
{
  "message": "Successfully unsubscribed from all future emails",
  "email": "user@example.com",
  "details": {
    "removedFromDatabase": true,
    "removedFromMailingList": true,
    "timestamp": "2024-01-15T..."
  }
}
```

**Response (400)**
```json
{
  "error": "Invalid or expired unsubscribe token",
  "details": "The unsubscribe link may have expired or been used already"
}
```

**Used for:** Unsubscribe page / link in emails

---

## 8. Contact Form

**Request**
```
POST /api/send-mail
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here (min 10 chars)"
}
```

**Response (200)**
```json
{ "message": "Message sent successfully." }
```

**Response (400)**
```json
{ "message": "Name is required." }
{ "message": "Invalid email address." }
{ "message": "Message must be at least 10 characters." }
```

**Response (429)** — Rate limit (1 min cooldown)
```json
{
  "message": "Please wait 1 minute(s) before submitting again.",
  "remainingSeconds": 45
}
```

**Used for:** Contact page form

---

## Summary: APIs We Need

| # | Method | Endpoint | Use Case |
|---|--------|----------|----------|
| 1 | GET | `/api/articles?limit=7&isFeatured=true&type=news` | Top Stories + Home hero (7 featured, first = hero) |
| 2 | GET | `/api/articles?limit=12&type=news` | Latest news carousel (order by createdAt desc) |
| 3 | GET | `/api/articles/pagination?page=1&itemsPerPage=9&type=news` | All news with pagination |
| 4 | GET | `/api/article/[slug]?type=news` | Single article page |
| 5 | GET | `/api/search?q=term&limit=20` | Search |
| 6 | POST | `/api/subscribe` | Newsletter signup |
| 7 | POST | `/api/unsubscribe` | Newsletter unsubscribe |
| 8 | POST | `/api/send-mail` | Contact form |
