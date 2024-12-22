## Tajify API Documentation

API BASE URL:
[Tajify API](https://api-tajify-production.up.railway.app)

### Test Login Details

-   **identifier** `08157113270 or user@example.com`
-   **password** `test1234`

### API ENDPOINTS:

<!--

#### API ENDPOINTS:
API BASE URL:
https://api-tajify-production.up.railway.app


### API Test Login Details

-   **identifier** `08157113270 or user@example.com`
-   **password** `test1234`

 -->

#### Authentication:

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
			"email": "user@example.com"
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
			"email": "user@example.com"
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

-   **GET** `/api/users/me`  
    Retrieves the currently authenticated user's information.

-   **DELETE** `/api/users/delete-account`  
    Delete the currently authenticated user.

-   **PATHC** `/api/users/update-password`  
    Change password for the currently authenticated user.
-   **Request Body:**

```json
{
	"password": "123456789",
	"newPassword": "1234567890$$",
	"newPasswordConfirm": "1234567890$$"
}
```

### Creator Profile:

-   **POST** `/api/user/become-a-creator`
    Creates a creator profile for the athenticated user and make them a creator therefore they can now upload content. (Protected) - No request body needed

-   **GET** `/api/users/profile`  
    Retrieves the currently authenticated user's profile information.

### Wallet:

-   **POST** `/api/wallets/create`
    Create a wallet for the authenticated user (Protected) - No request body needed

-   **GET** `/api/wallets/my-balance`  
    Retrieves the currently authenticated user's wallet balance.

### Tube:

-   **GET** `/api/tubes?type=tube-short&limit=10&page=1`
    Lists all tubes randomly based on an algroithm (paginated).

-   **GET** `/api/tubes/{id}`
    Get a single tube by id

-   **POST** `/api/tubes/create`
    Creates a new tube. (protected)
-   **Request Body:**

```json
{
	"title": "A good way to make money",
	"description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam omnis, pariatur nobis numquam quidem quo?",
	"type": "tube-short"
}
```

-   **Important Note:**
    1. Description can be in any format including HTML or just ordinary text
    2. You need to upload the tube video content seperately from the tube creation, so after create
-   **Request Body:**

```json
{
	"status": "success",
	"message": "Tube created!",
	"data": {
		"tube": {
			"creator": "67672cfe46cebe48315a9104",
			"title": "A good way to make money",
			"description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam omnis, pariatur nobis numquam quidem quo?",
			"videoFIleUrl": "",
			"thumbnailUrl": "",
			"views": 0,
			"likes": 0,
			"shares": 0,
			"saves": 0,
			"comments": 0,
			"type": "tube-short",
			"hashTags": ["#makemoney2024", "#moneyisgood"],
			"_id": "67673ee56260c6a83b4f5c03",
			"createdAt": "2024-12-21T22:19:17.436Z",
			"updatedAt": "2024-12-21T22:19:17.436Z",
			"lastModified": null,
			"slug": "a-good-way-to-make-money",
			"__v": 0
		}
	}
}
```

-   **POST** `/api/tubes/upload-video/{id}`
    Upload the tube video and thumbnail. I assume you know how to use formData...make sure to use formData (protected)

-   **GET** `/api/tubes/my-tube`
    Get tubes related to the logged in creator. (protected)

-   **PATCH** `/api/tubes/{id}`
    Updates an existing tube by Id. (protected)

-   **DELETE** `/api/tubes/{id}`
    Deletes a tube by Id. (protected)
