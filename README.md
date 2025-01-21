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

-   **GET** `/api/auth/users/me`  
    Retrieves the currently authenticated user's information.

-   **DELETE** `/api/auth/users/delete-account`  
    Delete the currently authenticated user.

-   **PATHC** `/api/auth/users/update-password`  
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

-   **GET** `/api/profile`  
    Retrieves all user's profile information.

-   **GET** `/api/profile/my-profile`  
    Retrieves the currently authenticated user's profile information.

-   **POST** `/api/profile/become-a-creator`
    Creates a creator profile for the athenticated user and make them a creator therefore they can now upload content. (Protected) - No request body needed.

### Wallet:

-   **POST** `/api/wallets/create`
    Create a wallet for the authenticated user (Protected) - No request body needed

-   **GET** `/api/wallets/my-balance`  
    Retrieves the currently authenticated user's wallet balance.

### Tube:

-   **GET** `/api/channels/tubes?type=tube-short&limit=10&page=1`
    Lists all tubes randomly based on an algroithm (paginated).

-   **GET** `/api/channels/tubes/{id}`
    Get a single tube by id

-   **POST** `/api/channels/tubes/upload`
    Uploades a new tube. (protected)
-   **Request Body:**

```json
{
	"title": "A good way to make money",
	"description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam omnis, pariatur nobis numquam quidem quo?",
	"type": "tube-short",
	"video": {"File Object"},
	"thumbnail": {"File Object"},
	"hashTags": ["#makemoney2024", "#moneyisgood"],
}
```

-   **Important Note:**
    1. Description can be in any format including HTML or just ordinary text
	2. Upload Everything together, Including the media (thumbnail and video) as well as the content details, But it as to be a formdata
-   **Request Body:**

```json
{
	"status": "success",
	"message": "Tube uploaded!",
	"data": {
		"tube": {
			"creator": "67672cfe46cebe48315a9104",
			"title": "A good way to make money",
			"description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam omnis, pariatur nobis numquam quidem quo?",
			"video": {
				"url": "https://res.cloudinary.com/dy3bwvkeb/video/upload/v1735849346/grbxt58knxbcpsayjnrs.mp4",
				"public_id": "tube-327312812910",
				"duration_in_sec": 102.23
			},
			"thumbnail": {
				"url": "https://res.cloudinary.com/dy3bwvkeb/image/upload/v1735849346/grbxt58knxbcpsayjnrs.jpg",
				"public_id": "thumbnail-327312812910"
			},
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

-   **GET** `/api/channels/tubes/my-tube`
    Get tubes related to the logged in creator. (protected)

-   **PATCH** `/api/channels/tubes/{id}`
    Updates an existing tube by Id. (protected)

-   **DELETE** `/api/channels/tubes/{id}`
    Deletes a tube by Id. (protected)




### Audio - music:

-   **POST** `/api/channels/audio/upload`
    Uploades a new audio music. (protected)
-   **Request Body:**

```json
{
	"title": "Imago dei - Gospel chant",
	"description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. (optional)",
	"audio": {"File Object"},
	"coverImage": {"File Object"},
}
```

-   **Important Note:**
    1. The title and audio field and cover image are required, others are optional
	2. Upload Everything together using formdata
-   **Request Body:**

```json
{
    "status": "success",
    "message": "Audio Uploaded",
    "data": {
        "audio": {
            "creator": "67672cfe46cebe48315a9104",
            "title": "Imago dei - Gospel chant",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            "streams": 0,
            "likes": 0,
            "audio": {
				"url": "https://res.cloudinary.com/dy3bwvkeb/video/upload/v1735905353/Imago%20dei%20-%20Gospel%20chant.mp3",
				"public_id": "audio-84543873232",
				"duration_in_sec": 102.23
			},
            "coverImage": {
				"url": "https://res.cloudinary.com/dy3bwvkeb/image/upload/v1735905531/1735905528566.png",
				"public_id": "coverimage-84543873232"
			},
            "_id": "6777d0fa362b946f247b3e2d",
            "createdAt": "2025-01-03T11:58:50.461Z",
            "updatedAt": "2025-01-03T11:58:50.461Z",
            "slug": "imago-dei-gospel-chant",
            "__v": 0
        }
    }
}
```