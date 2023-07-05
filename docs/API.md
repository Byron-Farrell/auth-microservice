# API Documentation

Welcome to the API documentation for our service. Here you will find detailed information about the available endpoints and their functionalities.

## Table of Contents

- [JSON Response Format](#json-response-format)
- [User Endpoints](#user-endpoints)
  - [Get User by ID](#get-user-by-id)
  - [Get All Users](#get-all-users)
  - [Delete a user by ID](#delete-a-user-by-id)
- [Authentication Endpoints](#authentication-endpoints)
  - [Login](#login)
  - [Register User](#register-user)

## JSON Response Format

All requests will return a JSON object following the format below. 

```json
{
  "success": "Boolean - Indicates whether the request was successful or not",
  "message": "A message describing the result of the request",
  "payload": {
    "data": "Data returned by the request, if any",
    "errors": [
      {
        "field": "The field on which the error occurred",
        "message": "A message describing the error"
      }
    ]
  }
}
```
## User Endpoints


### Get User by ID
Gets user details by user ID

#### URL

```
GET /user/:userId
```

#### Response

###### body
```json
{
  "success": true,
  "message": "Successfully retrieved user",
  "payload": {
    "data": {
      "id": "1",
      "username": "john.doe"
    }
  }
}
```
**Status Code:** 200

---

### Get All Users
Gets a list of all user details

#### URL

```
GET /user
```

#### Response

###### Body

```json
{
  "success": true,
  "message": "Successfully retrieved 2 users",
  "payload": {
    "data": [
      {
        "id": "1",
        "username": "john.doe"
      },
      {
        "id": "2",
        "username": "john.doe"
      }
    ]
  }
}
```

**Status Code:** 204

---

### Delete a user by ID
Deletes a by user ID

#### URL

```
DELETE /user/:userId
```

#### Response

**Status Code:** 200

## Authentication Endpoints

### Login
Authenticates a user and returns a JSON web token

#### URL

```
POST /auth/login
```

#### Request

###### body

```json
{
  "username": "Login successful",
  "password": "123"
}
```

#### Response

###### body

```json
{
  "success": true,
  "message": "Successfully retrieved user",
  "payload": {
    "data": "header.payload.signature"
  }
}
```

**Status Code:** 200

---

### Register User
Creates a new user object

#### URL

```
POST /auth/register
```

#### Request

###### body

```json
{
  "username": "john.doe",
  "password": "123"
}
```

#### Response

###### body

```json
{
  "success": true,
  "message": "Successfully created user",
  "payload": {
    "data": {
      "id": "1",
      "username": "john.doe"
    }
  }
}
```

**Status Code:** 201

---

### Patch User
Creates a new user object

#### URL

```
PATCH /user/:userId
```

#### Request

###### body

```json
{
  "username": "john.doe2",
}
```

#### Response

###### body

**Status Code:** 204

