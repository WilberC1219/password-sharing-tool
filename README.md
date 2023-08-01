# password-sharing-tool

A password sharing tool designed for sharing passwords securely

### Table of Contents

- [Password sharing tool description](#password-sharing-tool)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Database Schema](#database-schema)

## Features

- Sign-up: Users can register for an account by providing their necessary information.

- Login: Users can enter their credentials (such as email and password) to log in to their accounts. After successful login, users are given a JSON Web Token that can be used for secure subsequent authenticated requests.

- Saving: Users can securely store their login credentials for all their accounts. The server utilizes the user's personal encryption key to safeguard the saved login information.

- Sharing: Users can securely share any of their saved login credentials. The server utilizes the server environment encryption key to safeguard any shared login information.

- Viewing: Users have the convenience of accessing all their stored login credentials. The passwords owned by the user will be grouped under the `My passwords` tab, while passwords shared with the user will be under the `Passwords shared with me` tab.

- Sessions: Users have the convenience of login sessions, which eliminates the need to sign in each time they access the password sharing tool. These sessions remain valid for one hour and are securely stored on the user's end using a JSON Web Token.

## Technologies Used

- Frontend: Retool
- Backend: Node.js, Express, Sequelize, SQLite

## Setup and Installation

- Coming Soon

## Database Schema

- Coming Soon

## Api Endpoints

### `/signup`

#### `HTTP request`

- The `/signup` endpoint is designed to handle user registration:<br>`POST http://localhost:{ENV_PORT}/signup`

#### `HTTP header`

- `Content-Type` : `application/json`

#### `Request body`

- contains an object that represents an instance of a `User`

```
// User object representation
{
	"firstName": string,
    "lastName": string"
	"email": string,
	"password": string,
	"key": string
}
```

| Fields      |                                 |
| ----------- | ------------------------------- |
| `firstName` | The first name of the user.     |
| `lastName`  | The last name of the user.      |
| `email`     | The email address of the user.  |
| `password`  | The password of the user.       |
| `key`       | The encryption key of the user. |

- All fields cannot be null or empty strings. In addition, the `password` field must be 8 to 16 characters long and the `key` field must be 6 to 10 characters long.

#### `Response body`

- If the request is successful, you will receive a response:

```
// Success response body
{
    message: `Sign up was successful!`
}
```

- If the request was not successfull: [Response body error](#response-body-error)

### `/login`

#### `HTTP request`

- The `/login` endpoint is designed to handle a user logging in:<br>`POST http://localhost:{ENV_PORT}/login`

#### `HTTP header`

- `Content-Type` : `application/json`

#### `Request body`

- contains login credentials object

```
// login credentials object representation
{
	"email": string,
	"password": string,
	"key": string
}
```

| Fields     |                                 |
| ---------- | ------------------------------- |
| `email`    | The email address of the user.  |
| `password` | The password of the user.       |
| `key`      | The encryption key of the user. |

#### `Response body`

- If the request is successful, you will receive a response:

```
// Success response body
{
    message: "Login was successful",
    payload: {
        user: {
            firstName, // user's first name
            email // user's email address
        },
        token: jwt // token for user's session.
    }
}
```

- The `token` serves as the user's session identifier and will be used in future requests. It is stored and included in the `Authorization` header for endpoints that require authorization. The token has a validity of 1 hour, requiring the user to log in again to obtain a new token after that period.

- If the request was not successfull: [Response body error](#response-body-error)

### `/save-password`

#### `HTTP request`

- The `/save-password` endpoint is designed to store a user's password:<br>`POST http://localhost:{ENV_PORT}/save-password`

#### `HTTP header`

- `Content-Type` : `application/json`
- `Authorization`: `Bearer {TOKEN}`

#### `Request body`

- contains login credentials for a platform

```
// login credentials object representation
{
	"url": string,
	"login": string,
	"password": string,
	"label": string,
	"key": string
}
```

| Fields     |                                                                     |
| ---------- | ------------------------------------------------------------------- |
| `url`      | The url that is associated with the login credentials.              |
| `login`    | The login that is associated with the login credentials.            |
| `password` | The password that is associated with the login credentials.         |
| `label`    | The label which is use to give context about the login credentials. |
| `key`      | The encryption key of the user.                                     |

#### `Response body`

- If the request is successful, you will receive a response:

```
// Success response body
{
    message: `Password was successfully saved!`
}
```

- If the request was not successfull: [Response body error](#response-body-error)

### `/share-password`

#### `HTTP request`

- The `/share-password` endpoint is designed to enable the sharing of a user's saved password with another user who also has an account:<br>`POST http://localhost:{ENV_PORT}/share-password`

#### `HTTP header`

- `Content-Type` : `application/json`
- `Authorization`: `Bearer {TOKEN}`

#### `Request body`

- contains share password object

```
// share password object representation
{
	"shared_to_email": string,
	"password_id": string,
	"key": string
}
```

| Fields            |                                                                      |
| ----------------- | -------------------------------------------------------------------- |
| `shared_to_email` | The recipient's email address for whom the password is being shared. |
| `password_id`     | The password that is being shared.                                   |
| `key`             | The encryption key of the user.                                      |

#### `Response body`

- If the request is successful, you will receive a response:

```
// Success response body
{
    message: `Successfully shared password with ${shared_to_email}`,
    shared_password: {
		"id": "PASSWORD_ID",
		"owner_id": "OWNER_ID",
		"shared_to_id": "SHARED_TO_ID",
		"url": "URL",
		"login": "ENCRYPTED_LOGIN",
        "password":"ENCRYPTED_PASSWORD",
		"label": "LABEL",
		"updatedAt": "2023-08-01T12:38:59.450Z",
		"createdAt": "2023-08-01T12:38:59.450Z"
	}
}
```

- If the request was not successfull: [Response body error](#response-body-error)

### `/list-saved-passwords`

#### `HTTP request`

- The `/list-saved-passwords` endpoint is designed to fetch all the saved passwords of the currently logged-in user:<br>`POST http://localhost:{ENV_PORT}/list-saved-passwords`

#### `HTTP header`

- `Content-Type` : `application/json`
- `Authorization`: `Bearer {TOKEN}`

#### `Request body`

- no fields required

```
// list-saved-passwords request body
{}
```

#### `Response body`

- If the request is successful, you will receive a response:

```
// Success response body
{
	"message": "Successfully retrieved saved passwords!",
	"data": [ // list of saved passwords
		{
			"id": "PASSWORD_ID",
			"url": "URL",
			"login": "DECRYPTED_LOGIN",
			"password": ""DECRYPTED_PASSWORD",
			"label": "LABEL"
		}
	]
}
```

- If the request was not successfull: [Response body error](#response-body-error)

### `/list-shared-passwords`

#### `HTTP request`

- The `/list-shared-passwords` endpoint is designed to retrieve a list of shared passwords that involve the currently logged-in user. This includes both a list of passwords shared by the logged-in user and a list of passwords shared with the logged-in user by others:<br>`POST http://localhost:{ENV_PORT}/list-shared-passwords`

#### `HTTP header`

- `Content-Type` : `application/json`
- `Authorization`: `Bearer {TOKEN}`

#### `Request body`

- no fields required

```
// list-shared-passwords request body
{}
```

#### `Response body`

- If the request is successful, you will receive a response:

```
// Success response body
{
	"message": "Successfully retrieved shared passwords!",
	"data": {
		"shared_by_owner": [ // list of passwords shared by the logged in user
			{
				"id": "PASSWORD_ID",
				"owner_id": "OWNER_ID",
				"shared_to_id": "SHARED_TO_ID",
				"url": "URL",
				"login": "DECRYPTED_LOGIN",
				"password": "DECRYPTED_PASSWORD",
				"label": "LABEL",
				"shared_to_user": {  // Email of user that this password was shared with
					"email": "SHARED_TO_EMAIL"
				}
			}
		],
		"shared_with_owner": [ // list of passwords shared with the logged in user
			{
				"id": "PASSWORD_ID",
				"owner_id": "OWNER_ID",
				"shared_to_id": "SHARED_TO_ID",
				"url": "URL",
				"login": "DECRYPTED_LOGIN",
				"password": "DECRYPTED_PASSWORD",
				"label": "LABEL",
				"shared_by_user": { // Email of user that shared this password with logged in user
					"email": "SHARED_BY_EMAIL"
				}
			}
		]
	}
}
```

- If the request was not successfull: [Response body error](#response-body-error)

## Response body error

- If any error occurs after making a request, the response body will provide information regarding the specific error encountered.

```
{
    errorMessage: "SOME_ERROR_MESSAGE",
    errorDetails:{
        type: "ERROR_NAME",
        cause:"ERROR_CAUSE"
    }
}
```

## Available Scripts

Scripts that are useful to know about in this project:

### `npm start`

Starts the server in production mode, utilizing the port specified by the environment variable `PORT`. If the `PORT` environment variable is not set, the server defaults to listening on port 3000.

### `npm run start:dev`

Starts the server in development mode using the nodemon tool. With nodemon, the server automatically restarts whenever changes are made to any `.js` file in the `src` directory by default. To customize the configuration settings for nodemon, modify the `nodemon.json` file located at the root directory of this project.

### `npm run migrate:up`

Used to apply pending database migrations. This command runs all pending migrations in the `src/migrations` directory and applies them to the database.

### `npm run migrate:down`

Used to undo the last applied database migration. This command reverts the most recent migration applied to the database.

### `npm run migrate:down:all`

Used to undo all applied database migrations. This command reverts all previously applied migrations in reverse order.

### `npm run migrate:options`

This command provides you with a reference to understand and utilize the various flags and functionalities available when performing migrations.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or questions, please contact me at wilberclaudio@gmail.com.

```

```
