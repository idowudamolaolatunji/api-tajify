## Tajify API Documentation

API BASE URL:
[Tajify API](https://api-tajify-production.up.railway.app)


### Test Login Details

-   **identifier** `08157113270 or user@example.com`
-   **password** `test1234`  


### API Routes

#### Authentication Routes

-   **POST** `/api/auth/login`  
    Authenticates a user and returns a token.
-   **Request Body:**

```json
{
	"identifier": "08157113270",
	"password": "test1234"
}
```
or
```json
{
	"identifier": "user@example.com",
	"password": "test1234"
}
```

-   **Response:**

    -   **200 OK:** Login successful
    -   **400 Bad Request:** Account does not or no longer exist
    -   **400 Bad Request:** User details incorrect

-   **Example Response:**
```json
{
	"status": "success",
	"message": "Login successful",
	"data": {
		"user": {
            "_id": "67672cfe46cebe48315a9104",
            "firstname": "taiwo",
            "lastname": "bankole",
            "username": "taiwo_banks001",
            "phoneNumber": "08157113270",
            "email": "user@example.com",
            "image": "",
            "role": "user",
            "isActive": true,
            "isOtpVerified": true,
            "createdAt": "2024-12-21T21:02:54.790Z",
            "updatedAt": "2024-12-21T21:13:47.538Z",
            "slug": "taiwo-bankole-6767",
            "fullname": "taiwo bankole",
            "otpExpiresIn": "2024-12-21T21:15:31.190Z",
            "__v": 0,
            "otpIssuedAt": "2024-12-21T21:13:31.181Z",
            "passwordChangedAt": "2024-12-21T21:13:47.438Z"
        }
	},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NjcyY2ZlNDZjZWJlNDgzMTVhOTEwNCIsImlhdCI6MTczNDgxOTMwNSwiZXhwIjoxNzM3NDExMzA1fQ.ZNf2pnpBDqdKFKisysPGl5U8mfzf_jvU80pBz8PkWcA"
}
```


-   **POST** `/api/auth/signup`  
    Registers a new user account. and then an OTP is sent when the user requests for an OTP
-   **Request Body:**

```json
{
	"firstname": "taiwo",
	"lastname": "bankole",
	"username": "taiwo_banks001",
	"email": "user@example.com",
	"phoneNumber": "08157113270",
	"password": "test1234",
	"passwordConfirm": "test1234"
}
```

-   **Response:**
    -   **201 OK:** Account created successful
    -   **400 Bad Request:** No user with this email

-   **Example Response:**
```json
{
	"status": "success",
	"message": "Account created successful",
	"data": {
        "user": {
            "name": "taiwo",
            "email": "user@example.com",
        }
    }
}
```


-   **PATCH** `/api/auth/request-otp`
    Resends an OTP to the user’s email.

-   **Request Body:**
```json
{
	"email": "user@example.com"
}
```

-   **Response:**
    -   **200 OK:** OTP verification code resent
    -   **400 Bad Request:** Account alreadty verified!

-   **Example Response:**
```json
  {
    "status": "success",
    "message": "OTP verification code resent",
    "data": {
        "user": {
            "name": "taiwo",
            "email": "user@example.com",
        }
    }
  }
```


-   **PATCH** `/api/auth/verify-otp`  
    Verifies the OTP entered by the user and marks their email as verified if successful.

-   **Request Body:**
```json
{
	"email": "user@example.com",
	"otp": 2280
}
```

-   **Response:**
    -   **200 OK:** OTP verified successfully
    -   **400 Bad Request:** Account alreadty verified!
    -   **400 Bad Request:** OTP Expired, Request new OTP!
    -   **400 Bad Request:** Invalid OTP code!

-   **Example Response:**
```json
  {
    "status": "success",
    "message": "OTP verified successfully",
    "data": {
        "user": {
            "_id": "67672cfe46cebe48315a9104",
            "firstname": "taiwo",
            "lastname": "bankole",
            "username": "taiwo_banks001",
            "phoneNumber": "08157113270",
            "email": "user@example.com",
            "image": "",
            "role": "user",
            "isActive": true,
            "isOtpVerified": true,
            "createdAt": "2024-12-21T21:02:54.790Z",
            "updatedAt": "2024-12-21T21:13:47.538Z",
            "slug": "taiwo-bankole-6767",
            "fullname": "taiwo bankole",
            "otpExpiresIn": "2024-12-21T21:15:31.190Z",
            "__v": 0,
            "otpIssuedAt": "2024-12-21T21:13:31.181Z",
            "passwordChangedAt": "2024-12-21T21:13:47.438Z"
        }
    }
  }
```


-   **PATCH** `/api/auth/forgot-password/`  
    Sends a password reset link to the user's registered email with a token embedded in the mail.

-   **Request Body:**
```json
{
	"email": "user@example.com"
}
```


-   **PATCH** `/api/auth/reset-password/:token`
    Resets the user's password using a provided token in the forgot-password mail.

-   **Request Body:**
```json
{
	"password": "123456789",
	"passwordConfirm": "123456789"
}
```


-   **GET** `/api/auth/logout`  
    Logs out an authenticated user.


<!--

### Categories Routes (Categories Management)

- **GET** `api/v1/categories`
  Lists all categories with a count of associated events (paginated).

- **POST** `api/v1/categories`
  Creates a new category.

- **POST** `api/v1/categories/{categoryId}`
  Updates an existing category.

- **PATCH** `api/v1/categories/{categoryId}/toggle-status`
  Toggles the status (enabled/disabled) of a category.

- **DELETE** `api/v1/categories/{categoryId}`
  Deletes a category.

### Events Routes (Events Management)

- **GET** `api/v1/events`
  Lists all events with optional search and filtering.

- **POST** `api/v1/events`
   Creates a new event.

  - **POST** `api/v1/events/overview`
    Validates event overview details. (When a user clicks on save and continue but it doesn't submit the form)

  - **POST** `api/v1/events/gallery`
    Validates gallery images for an event. (When a user clicks on save and continue but it doesn't submit the form)

  - **POST** `api/v1/events/tickets`
     Validates tickets associated with an event. (When a user clicks on save and continue but it doesn't submit the form)

    **Example Request**:

    ```json
    POST /api/v1/events
    {
    "user_id": 1,
    "category_id": 2,
    "event_name": "Tech Conference 2024",
    "event_description": "A conference for tech enthusiasts, developers, and entrepreneurs to network and learn about the latest trends in technology.",
    "status": "Pending",
    "featured": true,
    "price": 99.99,
    "event_type": "physical",
    "event_location": "Tech Arena, Downtown City",
    "start_date": "2024-12-01",
    "start_date_time": "09:00:00",
    "end_date": "2024-12-01",
    "end_date_time": "18:00:00",
    "cover_photo": "path_to_cover_photo.jpg",
    "event_image": "path_to_event_image.jpg",
    "tickets": [
    {
    "ticket_category": "Single Ticket",
    "ticket_type": "paid",
    "ticket_name": "General Admission",
    "ticket_description": "General access to all sessions and workshops.",
    "ticket_stock": "Limited Stock",
    "ticket_quantity": 500,
    "ticket_price": 99.99,
    "ticket_purchase_limit": 5,
    "transfers_fees_to_guest": false,
    "group_size": null
    },
    {
    "ticket_category": "Group Ticket",
    "ticket_type": "paid",
    "ticket_name": "VIP Group Package",
    "ticket_description": "VIP access with additional perks, including a meet-and-greet with the speakers.",
    "ticket_stock": "Limited Stock",
    "ticket_quantity": 100,
    "ticket_price": 499.99,
    "ticket_purchase_limit": 10,
    "transfers_fees_to_guest": true,
    "group_size": 5
    }]
    }
    ```

- **PUT** `api/v1/events/{eventId}/update-details`
  Updates event overview details of a particular event.

- **POST** `api/v1/events/{eventId}/update-gallery`
  Updates event gallery images of a particular event.

- **PUT** `api/v1/events/{eventId}/update-tickets`
  Updates tickets associated with an event.

- **GET** `api/v1/events/{eventId}/tickets`
  Retrieves all tickets associated with a specific event.

- **DELETE** `api/v1/events/{eventId}/tickets/{ticketId}`
  Deletes a specific ticket from an event.

- **DELETE** `api/v1/events/{eventId}`
  Deletes an event and all resources attributed to it.

---

## Testing

### Testing with Postman

1. **Import API Documentation**
   Use this README or individual API routes in Postman to organize and test each endpoint.

2. **Environment Setup**
   Use Postman environment variables for `base_url`, `access_token`, etc., to simplify testing.

3. **Testing Image Uploads**
   For image fields (e.g., `cover_photo`, `event_image`), set `form-data` in Postman with the `file` data type for uploads.

4. **Pagination**
   Append `page` query parameters as needed:

   ```http
   GET /api/categories?page=2
   ```

---

## Example Request Bodies

### Category Creation

```json
{
  "category_name": "Music",
  "image": "image_url"
}
```

### Event Overview Updating

```json
{
  "user_id": 1,
  "category_id": 2,
  "event_name": "Concert 2024",
  "event_description": "An amazing music concert!",
  "status": "Pending",
  "featured": false,
  "price": 150.0,
  "event_type": "physical",
  "event_location": "New York",
  "start_date": "2024-12-25",
  "start_date_time": "19:00:00",
  "end_date": "2024-12-26",
  "end_date_time": "02:00:00"
}
```

### Ticket Updating

```json
{
  "event_id": 1,
  "ticket_category": "Single Ticket",
  "ticket_type": "paid",
  "ticket_name": "General Admission",
  "ticket_description": "Access to all areas.",
  "ticket_stock": "Limited Stock",
  "ticket_quantity": 100,
  "ticket_price": 50.0,
  "ticket_purchase_limit": 5,
  "transfers_fees_to_guest": true,
  "group_size": null
}
```

---

### Notifications Route

- **POST** `api/v1/notification-mail`
  Sends an email notification to specified users.

### Users/Organizers Management Routes

- **PUT** `api/v1/user/{id}/toggle-feature`
  Toggles the featured for a user by their ID.

  **PUT | PATCH** `api/v1/user/{id}`
  The admin is able to edit users/organizers details by their ID.

- **GET | HEAD** `api/v1/users`
  Retrieves a list of all users.

- **POST** `api/v1/users`
  Creates a new user.
  Users can be filtered by the following `active, kyc_verified, phone_verified, email_unverified, banned `.
  example : `/api/v1/users?filter=phone_verified`

- **GET | HEAD** `api/v1/users/{user}`
  Retrieves details for a specific user by their ID. and shows all relationships associated with the user

### Payment Integration/ticket checkout action

#### 1. Create Order and Initiate Payment

Initiates an order for a specific ticket and redirects the user to Paystack for payment.

- **POST** `/api/v1/order/{ticketId}/checkout`
- **Parameters**:
  - **Path Parameter**:
    - `ticketId` (integer, required): The ID of the ticket the user wants to purchase.
  - **Body Parameters** (JSON):
    - `ticket_quantity` (integer, required): Quantity of tickets to order.
    - `first_name` (string, required): Customer's first name.
    - `last_name` (string, required): Customer's last name.
    - `email` (string, required): Customer's email.
    - `confirm_email` (required and it should be same as the email),
    - `phone_number` (string, required): Customer's phone number.
    - `send_to_different_email` (boolean, optional): Whether to send the ticket to a different email.
    - `attendee_first_name`, `attendee_last_name`, `attendee_email`, `attendee_confirm_email`(same as the attendee_email) (required if `send_to_different_email` is `true` or `1`): Attendee's details.
- **Example Request**:

      ```json
      POST /api/order/123/checkout
      {
        "ticket_quantity": 2,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone_number": "1234567890",
        "send_to_different_email": true,
        "attendee_first_name": "Jane",
        "attendee_last_name": "Smith",
        "attendee_email": "jane.smith@example.com"
      }
      ```

- **Response**:

  ```json
  {
    "payment_url": "https://paystack.com/pay/xxxxxx"
  }
  ```

#### 2. Handle Payment Callback

Receives the payment status from Paystack and updates the order’s payment and status fields.

- **URL**: `/api/v1/payment/callback`
- **Method**: `GET`
- **Query Parameters**:

  - `reference` (string, required): The unique reference for the transaction provided by Paystack(automatically/manually).
    the ticket order_code is same as the reference `?reference=xxxxxxxx`

- **Description**: After payment on Paystack, this endpoint verifies the payment and updates the order’s `payment_status` and `status` fields:

  - If `status` is `paid`, the `status` is updated to `active`.
  - If `status` is `pending`, the `status` is updated to `pending`.
  - If `status` is `refunded`, the `status` is updated to `canceled`.

  It is very necessary for this endpoint to be used so as to send the Individual a ticket via mail

- **Example Request**:

  ```plaintext
  GET /api/payment/callback?reference=unique-reference-code
  ```

- **Response**:

  - **200 OK**: Your Ticket has been sent to you via the email provided.
  - **400 Bad Request**: Unable to verify transaction.

---

### Orders Management

- **GET | HEAD** `api/v1/orders`
  Retrieves a list of all orders.

- **GET | HEAD** `api/v1/orders/{order}`
  Retrieves details for a specific order by their ID.

---

### Withdrawals, Deposits, Balances Addition and Subtraction

#### 1. **Request Withdrawal**

- **Endpoint:** `/api/v1/user/request/withdrawal`
- **Method:** `POST`
- **Description:** Allows a user to initiate a withdrawal request. The requested amount will be pending approval from an admin.
- **Request Body Parameters:**
- `amount` (required): The amount the user wants to withdraw (must be greater than 1000 naira and less than the available balance).
- `password` (required): Authenticated user password
- **Example Request:**

  ```json
  {
    "amount": 1500,
    "password": "password" //For confirmation
  }
  ```

#### 2. **Approve Withdrawal (Admin Only)**

- **Endpoint:** `/api/v1/admin/approve/{transactionId}/withdrawal`
- **Method:** `POST`
- **Description:** Allows an admin to approve a withdrawal request, creating a transfer recipient and initiating the Paystack transfer.
- **URL Parameters:**
- transactionId` (required): The ID of the withdrawal transaction to be approved.
- **Example Usage:** `/api/v1/admin/approve/12345/withdrawal`

#### 3. **Reject Withdrawal (Admin Only)**

- **Endpoint:** `/api/v1/admin/reject/{transactionId}/withdrawal`
- **Method:** `POST`
- **Description:** Allows an admin to reject a withdrawal request. The transaction status will be updated to rejected, and the user will be notified with a remark whenever there check their transaction history.
- **URL Parameters:**
- `transactionId` (required): The ID of the withdrawal transaction to be rejected.
- **Example Usage:** `/api/v1/admin/reject/12345/withdrawal`

#### 4. **Handle Transfer Callback**

- **Endpoint:** `/api/v1/transfer/callback`
- **Method:** `GET`
- **Description:** Callback URL for Paystack to notify the application of the final status of a transfer. This endpoint will update the transaction status based on the transfer outcome.
- **Notes:** Paystack will send a `GET` request to this endpoint with details about the transfer status.

#### 5. **Add to user Balance**

- **Endpoint:** `/api/v1/users/{userId}/add-balance`
- **Method:** `POST`
- **Description:** This is the endpoint to be called if a user balance is about to be added.
- **URL Parameters**:
- `{userId}`: The unique ID of the user whose Balance you want to Add.

#### 6. **Subtract user Balance**

- **Endpoint:** `/api/v1/users/{userId}/subtract-balance`
- **Method:** `POST`
- **Description:** This is the endpoint to be called if a user balance is about to be subtracted.
- **URL Parameters** :
- `{userId}`: The unique ID of the user whose Balance you want to Subtract.

---

# API Endpoints - Admin Panel

This section covers the API routes that allow the admin to view transactions, deposits, and withdrawals for a particular user. The routes include filtering, searching by transaction reference, and date ranges.

### 1. **Get All Transactions for a Specific User**

- **Endpoint**: `GET /api/v1/users/{userId}/transactions`
- **Description**: Retrieve all transactions for a specific user.
- **URL Parameters**:
- `{userId}`: The unique ID of the user whose transactions you want to retrieve.

### 2. **Filter Transactions for a Specific User**

- **Endpoint**: `GET /api/v1/users/{userId}/transactions?transaction_reference={reference}&type={type}&remark={remark}&start_date={start_date}&end_date={end_date}`
- **Description**: Retrieve transactions for a specific user with various filters.
- **URL Parameters**:
  - `{userId}`: The unique ID of the user.
  - `transaction_reference`: Optional, filter by transaction reference (e.g., `a98a88fb-da1d-4f93-9304-1a977669b0df`).
  - `type`: Optional, filter by transaction type (`deposit` or `transfer`).
  - `remark`: Optional, filter by a specific remark (e.g., `Balance added by admin`).
  - `start_date`: Optional, filter transactions from a start date (e.g., `2024-01-01`).
  - `end_date`: Optional, filter transactions up to an end date (e.g., `2024-11-01`).

### 3. **Get a Specific Transaction by ID**

- **Endpoint**: `GET /api/v1/users/{userId}/transactions/{transactionId}`
- **Description**: Retrieve a specific transaction by its ID for a user.
- **URL Parameters**:
  - `{userId}`: The unique ID of the user.
  - `{transactionId}`: The unique ID of the transaction.

### 4. **Get All Deposits for a Specific User**

- **Endpoint**: `GET /api/v1/users/{userId}/deposits`
- **Description**: Retrieve all deposit transactions for a specific user.
- **URL Parameters**:
  - `{userId}`: The unique ID of the user.

### 5. **Get Deposit Counts for a Specific User**

- **Endpoint**: `GET /api/v1/users/{userId}/deposits/get-deposit-counts`
- **Description**: Retrieve the count of deposit transactions for a specific user.
- **URL Parameters**:
  - `{userId}`: The unique ID of the user.

### 6. **Filter Deposits for a Specific User**

- **Endpoint**: `GET /api/v1/users/{userId}/deposits?status={status}&start_date={start_date}&end_date={end_date}`
- **Description**: Retrieve deposits for a specific user with status and date filters.
- **URL Parameters**:
  - `{userId}`: The unique ID of the user.
  - `status`: Optional, filter by deposit status (`pending`, `completed`, etc.).
  - `start_date`: Optional, filter deposits from a start date (e.g., `2024-11-10`).
  - `end_date`: Optional, filter deposits up to an end date (e.g., `2024-11-11`).

### 7. **Get All Withdrawals for a Specific User**

- **Endpoint**: `GET /api/v1/users/{userId}/withdrawals`
- **Description**: Retrieve all withdrawal transactions for a specific user.
- **URL Parameters**:
  - `{userId}`: The unique ID of the user.

### 8. **Get Withdrawal Counts for a Specific User**

- **Endpoint**: `GET /api/v1/users/{userId}/withdrawals/get-withdrawal-counts`
- **Description**: Retrieve the count of withdrawal transactions for a specific user.
- **URL Parameters**:
  - `{userId}`: The unique ID of the user.

### 9. **Filter Withdrawals for a Specific User**

- **Endpoint**: `GET /api/v1/users/{userId}/withdrawals?status={status}`
- **Description**: Retrieve withdrawals for a specific user, filtered by status (e.g., `pending`, `approved`, `rejected`).
- **URL Parameters**:
  - `{userId}`: The unique ID of the user.
  - `status`: Optional, filter by withdrawal status (`pending`, `approved`, `rejected`)

#### **Ticket Verification**

- **Endpoint:** `/api/v1/ticket/verify`
- **Method:** `POST`
- **Description:** Allows a vendors to verify attendees Ticket.
- **Request Body Parameters:**
- `order_code` (required): The the order_code generated after purchase, which is also embedded with the QRcode.
- **Example Request:**

  ```json
  {
    "order_code": "YEC4YCZXW4"
  }
  ```

---

## Profile Management API Endpoints

#### 1. **View Profile**

- **Route**: `GET api/v1/profile`
- **Description**: Fetch the authenticated user's profile information.
- **Response**:
  ```json
  {
    "id": 1,
    "role": "admin|vendor|user",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+123456789",
    "address": "123 Street Name",
    "city": "City",
    "state": "State",
    "country": "Country",
    "profile_image": "profile_image_url",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
  ```

#### 2. **Update Personal Information**

- **Route**: `PUT api/v1/profile/personal-info`
- **Description**: Update the user's personal information such as name.
- **Request Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "username": "John1235r764t7",
    "email": "test@email.com",
    "phone_number": "+22434536"
  }
  ```

#### 3. **Update Contact Information**

- **Route**: `PUT api/v1/profile/contact-info`
- **Description**: Update the user's contact details such as address and phone number.
- **Request Body**: All fields are nullable
  ```json
  {
    "address": "123 Street Name",
    "city": "City",
    "state": "State",
    "zipcode": "12345",
    "country": "Country"
  }
  ```

#### 4. **Update Password**

- **Route**: `PUT api/v1/profile/password-update`
- **Description**: Update the user's password.
- **Request Body**:
  ```json
  {
    "current_password": "current_password",
    "new_password": "new_password",
    "new_password_confirmation": "new_password"
  }
  ```

#### 5. **Update Profile Picture**

- **Route**: `POST api/v1/profile/profile-picture-update`
- **Description**: Upload or update the user's profile picture.
- **Request Body** (Multipart/Form-Data):
  ```
  profile_image: [file]
  ```
- **Response**: Brings the image url
  ```json
  {
    "success": true,
    "message": "Profile picture updated successfully",
    "profile_image_url": "new_image_url"
  }
  ```

## GLOBAL SEARCH For vendors

- **Route**: `GET api/v1/search` || `GET api/v1/search?query=`
- **Description**: Fetch results for searches.
- **Response**:
  ```json
  {
    "query": "word"
  }
  ```

---

## Retrieve transaction for authenticated vendors

- **Route**: `GET api/v1/transactions` || `GET api/v1/transactions?search=`
- **Description**: Fetch transactions.

- **Route**: `GET api/v1/transactions/{transactionId}`
- **Description**: Fetch a particular transaction using the `{transactionId}`.

---

## Retrieve various categories of events on the landing page

- **Route**: `GET api/v1/featured-events`
- **Description**: Fetch featured events.

- **Route**: `GET /event/{eventId}/view`
- **Description**: Fetch details of a specific event and increment its view count.
- **Parameters**:
  - `eventId` (path): The ID of the event to view.
- **Response**:
  - **200 OK**: Event details including related tickets and gallery.
  - **404 Not Found**: Event does not exist.
- **Route**: `GET /event/popular`
- **Description**: Retrieve a list of the most popular events based on view count.
- **Response**:

  - **200 OK**: A list of popular events sorted by views in descending order.

- **Route**: `GET /event/free`
- **Description**: Fetch events that have free tickets available.
- **Response**:
  - **200 OK**: A list of events containing at least one free ticket.
  - **204 No Content**: No free events available.

### **Support Ticket API Documentation**

- **Route**: `GET /support-tickets`

  - **Description**: Fetch a paginated list of all support tickets.
    - Admins can view all tickets.
    - Vendors or regular users see only their own tickets.
  - **Response**:
    - **200 OK**: A paginated list of support tickets, including subject, priority, status, and last reply details.
  - **Example Response**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "subject": "Login Issue",
          "priority": "High",
          "status": "Open",
          "last_message": "Your issue has been resolved.",
          "last_reply_date": "2 hours ago"
        }
      ],
      "current_page": 1,
      "last_page": 3,
      "total": 25
    }
    ```

- **Route**: `GET /support-tickets/{ticketId}`

  - **Description**: Fetch details of a specific support ticket, including its message history and attachments.
  - **Parameters**:
    - `ticketId` (path): The ID of the ticket to view.
  - **Response**:
    - **200 OK**: Ticket details, including subject, priority, status, and replies.
    - **404 Not Found**: Ticket does not exist.

- **Route**: `POST /support-tickets`

  - **Description**: Create a new support ticket.
  - **Request Body**:
    - `subject` (required, string): The subject of the ticket.
    - `message` (required, string): The initial message or description of the issue.
    - `priority` (required, string): The priority level of the ticket (e.g., "High", "Medium", "Low").
    - `attachment`(optional)(bulk insertion too)
  - **Response**:
    - **201 Created**: Ticket successfully created.
  - **Example Request**:
    ```json
    {
      "subject": "Payment Issue",
      "message": "I was charged twice for my last transaction.",
      "priority": "High",
      "attachment[]": "file"
    }
    ```

- **Route**: `POST /support-tickets/{ticketId}/reply`

  - **Description**: Add a reply to a specific support ticket.
  - **Parameters**:
    - `ticket` (path): The ID of the ticket being replied to.
  - **Request Body**:
    - `message` (required, string): The reply message.
    - `attachments` (optional, file): Any files to attach to the reply.
  - **Response**:
    - **200 OK**: Reply added successfully.
  - **Example Request**:
    ```json
    {
      "message": "Can you provide more details about the payment issue?"
    }
    ```

- **Route**: `PATCH /support-tickets/{ticket}/status`

  - **Description**: Change the status of a ticket (e.g., from "Open" to "Closed" or vice versa).
  - **Parameters**:
    - `ticket` (path): The ID of the ticket to update.
  - **Request Body**:
    - `status` (required, string): The new status of the ticket (e.g., "Open", "Closed").
  - **Response**:
    - **200 OK**: Ticket status updated successfully.
  - **Example Request**:
    ```json
    {
      "status": "Closed"
    }
    ```

- **Route**: `DELETE /support-tickets/{ticketId}`
  - **Description**:Deletes a Support ticket and associated datas including attachments.
  - **Parameters**:
    - `ticketId` (path): The ID of the ticket to delete. -->
