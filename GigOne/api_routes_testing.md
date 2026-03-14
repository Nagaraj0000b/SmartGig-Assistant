# GigOne API Routes Testing Guide

This document contains all the API routes, their URIs, request methods, required headers, and expected request bodies for testing purposes (e.g., using Postman, Thunder Client, or cURL).

## Table of Contents

1. [Authentication](#1-authentication)
2. [Earnings](#2-earnings)
3. [Work Logs](#3-work-logs)
4. [Gigi AI Assistant](#4-gigi-ai-assistant)

---

## 1. Authentication

**Base URL:** `http://localhost:5000/api/auth`

### 1.1 Register a New User

- **Method:** `POST`
- **URI:** `/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "mysecurepassword123"
  }
  ```

### 1.2 Login User

- **Method:** `POST`
- **URI:** `/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "email": "jane@example.com",
    "password": "mysecurepassword123"
  }
  ```
  > **Note:** Successful login or registration returns a JWT `token`. You must include this token in the `Authorization` header for all protected routes below as `Bearer <token>`.

---

## 2. Earnings

**Base URL:** `http://localhost:5000/api/earnings`

### 2.1 Get All Earnings for User

- **Method:** `GET`
- **URI:** `/api/earnings`
- **Headers:**
  - `Authorization: Bearer <your_jwt_token>`

### 2.2 Add New Earnings Entry

- **Method:** `POST`
- **URI:** `/api/earnings`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_jwt_token>`
- **Body (JSON):**
  ```json
  {
    "platform": "Uber",
    "amount": 145.5,
    "hours": 5.5,
    "date": "2026-03-01T10:00:00Z"
  }
  ```

---

## 3. Work Logs

**Base URL:** `http://localhost:5000/api/worklogs`

### 3.1 Get All Work Logs for User

- **Method:** `GET`
- **URI:** `/api/worklogs`
- **Headers:**
  - `Authorization: Bearer <your_jwt_token>`

### 3.2 Add New Work Log Entry

- **Method:** `POST`
- **URI:** `/api/worklogs`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_jwt_token>`
- **Body (JSON):**
  ```json
  {
    "platform": "Swiggy",
    "hours": 4,
    "date": "2026-03-01T15:00:00Z",
    "notes": "Traffic was heavy near downtown, but good tips."
  }
  ```

---

## 4. Gigi AI Assistant

**Base URL:** `http://localhost:5000/api/gigi`

### 4.1 Transcribe Audio

- **Method:** `POST`
- **URI:** `/api/gigi/transcribe`
- **Headers:**
  - `Authorization: Bearer <your_jwt_token>`
  - _(Note: Do NOT set `Content-Type` manually in Postman/fetch when using form-data; the client sets the correct boundary automatically)._
- **Body (Multipart Form-Data):**
  - **Key:** `audio` (Type: File)
  - **Value:** Select an audio file (e.g., `test.mp3`, `test.m4a`).

### 4.2 Get Context (Weather & Traffic)

- **Method:** `GET`
- **URI:** `/api/gigi/context?lat={latitude}&lon={longitude}`
- **Headers:**
  - `Authorization: Bearer <your_jwt_token>`
- **Query Parameters:**
  - `lat`: User's latitude (e.g., `40.7128`)
  - `lon`: User's longitude (e.g., `-74.0060`)
- **Example URI:** `http://localhost:5000/api/gigi/context?lat=40.7128&lon=-74.0060`
