#  E-Commerce RESTful API

A robust, secure, and fully-featured RESTful API for an E-commerce platform built with **Node.js, Express, and MongoDB**. This API provides a complete backend solution including user authentication, product management, shopping cart, order processing with Stripe integration, and secure password recovery.

##  Key Features

* **Authentication & Authorization:** JWT-based authentication with role-based access control (Admin, User, Manager).
* **Security:** Hardened against common web vulnerabilities (XSS, CSRF, NoSQL Injection, HTTP Parameter Pollution) using `helmet`, `express-rate-limit`, and data sanitization.
* **Payment Gateway:** Seamless integration with **Stripe** using Webhooks (`/webhook-checkout`) for secure checkout processes.
* **Email Service:** Reliable and fast email delivery for password resets using the **Brevo REST API** with custom HTML templates.
* **Image Processing:** High-performance image uploads and resizing using `multer` and `sharp`.
* **Performance:** Request compression and intelligent error handling.

---

##  Tech Stack & Main Packages

* **Core:** Node.js, Express.js (`v5.x`)
* **Database:** MongoDB, Mongoose (`v9.x`)
* **Authentication:** `jsonwebtoken`, `bcryptjs`
* **Validation:** `express-validator`
* **File Uploads & Processing:** `multer`, `sharp`
* **Email Provider:** Brevo API (via `@getbrevo/brevo` SDK)
* **Payments:** `stripe`
* **Security & Utility:** `cors`, `compression`, `dotenv`, `slugify`, `morgan`, `hpp`
* **Dev Tools:** `eslint`, `prettier`, `nodemon`

---

##  Environment Variables (`config.env`)

To run this project locally, you need to create a `config.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# Database
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce

# JWT Settings
JWT_SECURETY_KEY=your_super_secret_jwt_key
JWT_EXPIRE_TIME=90d

# Email Settings (Brevo API)
BREVO_API_KEY=xkeysib-your_brevo_api_key_here
EMAIL_FROM=noreply@yourdomain.com

# Stripe
STRIPE_SECRET=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret


## 🧪 API Testing (Postman)

To make testing easier, a complete **Postman Collection** is included in this repository. It contains all the configured endpoints,
required payloads, and authorization headers.

### How to use it:
1. Open [Postman](https://www.postman.com/).
2. Click on **Import**
3. Select the `e-commerce-api-collection.json`
4. Set up your environment variables in Postman (e.g., `{{baseURL}} = http://localhost:3000/Api/v1`).
5. You're ready to test! (Start by registering a new user or logging in to get your JWT).

