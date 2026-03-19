# Database Requirements for Central Park News

**For the developer:** These are the database tables, columns, and access patterns the Central Park News app requires. Please ensure the PostgreSQL database on DigitalOcean has this structure and that we receive the connection string.

---

## 1. What We Need From You

- **PostgreSQL connection string** (URL) for the DigitalOcean database
- Format: `postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?sslmode=require`
- Port is typically `25060` for DigitalOcean managed databases

---

## 2. Required Tables & Columns

### Table: `authors`

| Column       | Type    | Required | Description                    |
|--------------|---------|----------|--------------------------------|
| id           | text    | Yes      | Unique ID (primary key)        |
| author_name  | text    | Yes      | Full name                      |
| name         | text    | No       | Display name                   |
| slug         | text    | No       | URL slug (e.g. `sarah-lee`)    |
| position     | text    | No       | Job title                      |
| imageURL     | text    | No       | Profile image URL              |

---

### Table: `articles`

| Column         | Type     | Required | Description                                      |
|----------------|----------|----------|--------------------------------------------------|
| id             | text     | Yes      | Unique ID (primary key)                         |
| title          | text     | Yes      | Article title                                    |
| content        | text     | Yes      | Body content (markdown)                           |
| titleSlug      | text     | Yes      | URL slug — **must be unique** (e.g. `my-article`) |
| status         | text     | Yes      | `published` or `draft`                           |
| type           | text     | Yes      | `news` or `article`                              |
| authorId       | text     | No       | Foreign key → `authors.id`                       |
| category       | text     | No       | Category name                                    |
| categoryId     | text     | No       | Category ID                                      |
| isFeatured     | boolean  | No       | `true` = shows in Top 7 Stories on homepage      |
| imageURL       | text     | No       | Main image URL                                   |
| excerpt        | text     | No       | Short description                                |
| date           | timestamp| No       | Publish date                                     |
| createdAt      | timestamp| Yes      | Creation date                                    |
| updatedAt      | timestamp| No       | Last update date                                 |
| position       | text     | No       | Position/order                                   |
| authorImg      | text     | No       | Author image URL                                 |
| authorImage    | text     | No       | Author image URL                                 |
| tags           | json     | No       | Tags (array or string)                           |
| socialImageUrls| json     | No       | `{ mobile: { url }, facebook: { url }, twitter: { url }, original: { url } }` |

**Indexes needed:** `status`, `createdAt`, `titleSlug`, `category`, `type` (for query performance)

---

### Table: `subscribe_users`

| Column           | Type     | Required | Description              |
|------------------|----------|----------|--------------------------|
| email            | text     | Yes      | Primary key              |
| unsubscribeToken | text     | Yes      | For unsubscribe links    |
| subscribedAt     | timestamp| No       | When they subscribed     |
| status           | text     | No       | Default: `active`        |
| tokenCreatedAt   | timestamp| No       | Token creation time      |
| tokenExpiresAt   | timestamp| No       | Token expiry             |
| tokenUsed        | boolean  | No       | Default: `false`         |
| tokenUsedAt      | timestamp| No       | When token was used      |

---

### Table: `contacts`

| Column     | Type     | Required | Description      |
|------------|----------|----------|------------------|
| id         | text     | Yes      | Unique ID        |
| name       | text     | Yes      | Sender name      |
| email      | text     | Yes      | Sender email     |
| message    | text     | Yes      | Message content  |
| ip         | text     | No       | IP address       |
| submittedAt| timestamp| No       | Submission time  |
| expiresAt | timestamp| Yes      | Cooldown expiry  |
| createdAt  | timestamp| No       | Creation time    |
| updatedAt  | timestamp| No       | Last update      |

**Indexes needed:** `(email, expiresAt)`, `(ip, expiresAt)` (for rate limiting)

---

## 3. How the App Uses the Data

| Feature                | Table(s)      | What we need                                      |
|------------------------|---------------|---------------------------------------------------|
| Homepage hero + Top 7  | articles      | `isFeatured = true`, `type = 'news'`, `status = 'published'` |
| News listing page      | articles      | Paginated, `type = 'news'`, `status = 'published'` |
| Single article page    | articles      | By `titleSlug`, with author join                  |
| Related articles       | articles      | By `category`, same `type`                        |
| Latest news carousel   | articles      | Latest `type = 'news'`, limit 12                  |
| Search                 | articles      | Search in `title` and `content`                   |
| RSS feed               | articles      | Latest published articles                         |
| Sitemap                | articles      | All published, by `titleSlug`                     |
| Newsletter subscribe   | subscribe_users | Create, read, update, delete by email          |
| Newsletter unsubscribe | subscribe_users | Verify token, mark used                          |
| Contact form           | contacts      | Create, check cooldown by email/IP                |
| Author pages           | authors       | List all authors for sitemap                      |
| Article author info    | authors       | Join articles → authors by `authorId`              |

---

## 4. Summary Checklist for Developer

- [ ] PostgreSQL database on DigitalOcean
- [ ] Table `authors` with columns above
- [ ] Table `articles` with columns above (with `titleSlug` UNIQUE)
- [ ] Table `subscribe_users` with `email` as primary key
- [ ] Table `contacts` with columns above
- [ ] Foreign key: `articles.authorId` → `authors.id`
- [ ] Indexes on articles: status, createdAt, titleSlug, category, type
- [ ] Data migrated (articles, authors, subscribers if any)
- [ ] Connection string provided to us with `?sslmode=require`
- [ ] Our IP / deployment IP in DigitalOcean Trusted Sources
