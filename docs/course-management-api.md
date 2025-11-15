# Manage Courses - `/api/v1/courses/`

## Create Course
- **Endpoint:** `POST /api/v1/courses/`
- **Auth:** Course Seller or Administrator
- **Request Body:**
  ```json
  {
    "title": "Intro to IELTS",
    "price": 129.99,
    "description": "Optional summary of the course.",
    "category": "ELTS",
    "courseLevel": "B2"
  }
  ```
- **Responses:**
  - `201 Created`
    ```json
    {
      "success": true,
      "message": "Course created successfully",
      "data": { /* Course object */ }
    }
    ```
  - `401 Unauthorized` if the user is not authenticated as a course seller/administrator.

## Get Course by ID
- **Endpoint:** `GET /api/v1/courses/{courseId}`
- **Auth:** Course Seller or Administrator
- **Responses:**
  - `200 OK`
    ```json
    {
      "success": true,
      "message": "Course retrieved successfully",
      "data": { /* Course object with lessons, ratings, test info */ }
    }
    ```
  - `404 Not Found` if the course does not exist.

## Update Course
- **Endpoint:** `PUT /api/v1/courses/{courseId}`
- **Auth:** Course Seller or Administrator
- **Request Body:** (any subset of the fields)
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "price": 149.00,
    "category": "IELTS",
    "courseLevel": "C1"
  }
  ```
- **Responses:**
  - `200 OK` with updated course data.
  - `404 Not Found` if the course does not exist.

## Publish Course
- **Endpoint:** `PUT /api/v1/courses/{courseId}/publish`
- **Auth:** Course Seller or Administrator
- **Responses:**
  - `200 OK` when the course is successfully published.
  - `400 Bad Request` if publication prerequisites (e.g., final test) are missing.
  - `404 Not Found` if the course does not exist.

## List Courses by Seller
- **Endpoint:** `GET /api/v1/courses/seller/{sellerId}`
- **Query Params:** `status` (optional)
- **Auth:** Course Seller or Administrator
- **Responses:**
  - `200 OK`
    ```json
    {
      "success": true,
      "message": "Courses retrieved successfully",
      "data": [ /* Course array */ ],
      "count": 5
    }
    ```

---

# Track Avg Completion Rate - `/api/v1/courses/{courseId}/analytics/completion`

- **Endpoint:** `GET /api/v1/courses/{courseId}/analytics/completion`
- **Query Params:** `export=csv|pdf` (optional)
- **Auth:** Course Seller or Administrator
- **Responses:**
  - `200 OK`
    ```json
    {
      "success": true,
      "message": "Completion rate retrieved successfully",
      "data": {
        "courseId": "....",
        "totalEnrolled": 42,
        "completedCount": 31,
        "completionRate": 73.81
      }
    }
    ```
  - `200 OK` with message "No data to calculate completion rate" if no enrollments exist.
  - `200 OK` when `export` is provided:
    ```json
    {
      "success": true,
      "message": "Export generated successfully",
      "data": {
        "filename": "intro_to_ielts_completion_2025-11-13.csv",
        "downloadUrl": "/api/exports/{courseId}/completion.csv?token=..."
      }
    }
    ```
  - `404 Not Found` if the course does not exist.

---

# Send Course Update Notification - `/api/v1/courses/{courseId}/notifications`

- **Endpoint:** `POST /api/v1/courses/{courseId}/notifications`
- **Auth:** Course Seller or Administrator
- **Request Body:**
  ```json
  {
    "title": "New lesson available",
    "content": "We've added Lesson 5: Writing Task 2 tips."
  }
  ```
- **Responses:**
  - `200 OK`
    ```json
    {
      "success": true,
      "message": "Notification has been sent successfully",
      "data": {
        "sentCount": 120,
        "failedCount": 0
      }
    }
    ```
  - `207 Multi-Status` if some deliveries failed (returns per-student details).
  - `400 Bad Request` if `title` or `content` is empty.
  - `404 Not Found` if the course does not exist or no students are enrolled.

---

# Manage Course Ratings - `/api/v1/courses/{courseId}/ratings`

## List Ratings
- **Endpoint:** `GET /api/v1/courses/{courseId}/ratings`
- **Query Params:**
  - `starRating` (1-5)
  - `startDate`, `endDate` (ISO date)
- **Auth:** Course Seller or Administrator
- **Responses:**
  - `200 OK` with ratings array and count.
  - `200 OK` with message "No reviews from students yet" if there are none.
  - `400 Bad Request` if filters are invalid.
  - `404 Not Found` if the course does not exist.

## Reply to Rating
- **Endpoint:** `POST /api/ratings/{ratingId}/reply`
- **Auth:** Course Seller or Administrator
- **Request Body:**
  ```json
  {
    "replyContent": "Thank you for your feedback!"
  }
  ```
- **Responses:**
  - `200 OK`
    ```json
    {
      "success": true,
      "message": "Reply added successfully",
      "data": { /* Rating with replyContent, repliedAt */ }
    }
    ```
  - `400 Bad Request` if `replyContent` is empty.
  - `404 Not Found` if the rating does not exist.

## Report Rating
- **Endpoint:** `POST /api/ratings/{ratingId}/report`
- **Auth:** Course Seller or Administrator
- **Responses:**
  - `200 OK`
    ```json
    {
      "success": true,
      "message": "Rating reported successfully",
      "data": { /* Rating with isReported true */ }
    }
    ```
  - `400 Bad Request` if the rating has already been reported.
  - `404 Not Found` if the rating does not exist.

