# final-project-gr2-backend

Instukcja endpointów:

## Endpoints

--------------------------R-E-G-I-S-T-E-R-------------------------
### User Register

- Frontend Request
- Method: POST
- Link part: "/api/users/register",
- **Request Body**
```json
{
    "username": "example",
    "email": "example@example.com",
    "password": "example-password", 
}
```


**Response**

- 1 Opcja - Validation Error:
- Response status: 400
- Response body: 
``` json
{
    "message": "{{Validation Error}}"
}
```

- 2 Opcja - Error: email or username is already used
- Response status: 409
- Response body: 
``` json
{
    "message": "Such {{'email' | 'username'}} is already registered"
}
```

- 3 Opcja - Send validation mail error 
- Response status: 500
- Response body: 
``` json
{
"serverMessage": "validation message failed",
"responseMsg": "Sendgrid error"
}
```

- 4 Opcja - Success registration 
- Response status: 201
- Response body: 
``` json
{
    "user": {
        "email": "example@example.com",
        "username": "String",
        "verify": false
    },
    "message":
        "If you cannot find verification email, please check spam folder",
}
```
--------------------------L-O-G-I-N----------------------------------
### Login 
- Frontend Request
- Method: PUT
- Link part: "/api/users/login",
- **Request Body**
```json
{
    "username": "example",
    CZY
    "email": "example@example.com",

    
    "password": "example-password", 
}
```


**Response**

- 1 Opcja - Validation Error:
- Response status: 400
- Response body: 
``` json
{
    "message": "{{Validation Error}}"
}
```


- 2 Opcja - Wrong user data:
- Response status: 401
- Response body: 
``` json
{
    "message": "Email/username or password is wrong"
}
```


- 3 Opcja - email verification error:
- Response status: 400
- Response body: 
``` json
{
    "message": "User is not verified"
}
```

- 4 Opcja - Success Login 
- Response status: 200
- Response body: 
``` json
{
    "user": {
        "email": "example@example.com",
        "username": "String",
        "verify": false,
        "todoListIds": [
            "IDS"
        ]
    },
    "token":
        "some token example",
}
```


--------------------L-O-G-O-U-T-------------------

### Logout

- Frontend Request
- Method: PUT
- Link part: "/api/users/logout",


- **Header key**
- Authorization: "Bearer {{tokenExample}}"



**Response**

- 1 Opcja - No token in header:
- Response status: 401
- Response body: 
``` json
{
    "message": "correct authorization Header"
}
```

- 2 Opcja - Wrong token:
- Response status: 401
- Response body: 
``` json
{
    "message": "Not authorized"
}
```

- 3 Opcja - Authorization Error (no such user):
- Response status: 401
- Response body: 
``` json
{
    "message": "Not authorized"
}
```

- 4 Opcja - Success Logout 
- Response status: 204
- Response body: 
``` json
{
    "message": "User logged out" 
}
```


----------------A-D-D---N-E-W---T-O-D-O------------

### AddNewTodo
- Frontend Request
- Method: POST
- Link part: "/api/todos",

**Header key**
- Authorization: "Bearer {{tokenExample}}"

**Request Body**
```json
{
    "title": "example",
    "difficulty": " one of ['easy', 'hard', 'normal']",
    "date": "21.01.2015",
    "time": "13:00:00",
    "status": " one of ['done', 'undone']",
    "category": "example",
    "type": " one of ['quest', 'challenge')",
}
```


**Response**

- 1 Opcja - No token in header:
- Response status: 401
- Response body: 
``` json
{
    "message": "correct authorization Header"
}
```


- 2 Opcja - Wrong token:
- Response status: 401
- Response body: 
``` json
{
    "message": "Not authorized"
}
```

- 3 Opcja - Authorization Error (no such user):
- Response status: 401
- Response body: 
``` json
{
    "message": "Not authorized"
}
```

- 4 Opcja - Data Validation Error:
- Response status: 400
- Response body: 
``` json
{
    "message": "{{Validation Error}}"
}
```

- 5 Opcja - Success AddNewTodo 
- Response status: 201
- Response body: 
``` json
{
    "message": "Todo added",
    "todo": {
        "title": "example",
        "difficulty": " one of ['easy', 'hard', 'normal']",
        "date": "21.01.2015",
        "time": "13:00:00",
        "status": " one of ['done', 'undone']",
        "category": "example",
        "type": " one of ['quest', 'challenge')",
    }
}
```

----------------G-E-T---A-L-L---T-O-D-O-S-----------

### getAllTodos
- Frontend Request
- Method: GET
- Link part: "/api/todos",

**Header key**
- Authorization: "Bearer {{tokenExample}}"


**Response**

- 1 Opcja - No token in header:
- Response status: 401
- Response body: 
``` json
{
    "message": "correct authorization Header"
}
```

- 2 Opcja - Wrong token:
- Response status: 401
- Response body: 
``` json
{
    "message": "Not authorized"
}
```

- 3 Opcja - Authorization Error (no such user):
- Response status: 401
- Response body: 
``` json
{
    "message": "Not authorized"
}
```

- 4 Opcja - Success
- Response status: 200
- Response Body
``` json
{
    "user": {
        "email": "example@example.com",
        "username": "String",
        "verify": false,
        "todoListIds": [
            {
                "title": "example",
                "difficulty": " one of ['easy', 'hard', 'normal']",
                "date": "21.01.2015",
                "time": "13:00:00",
                "status": " one of ['done', 'undone']",
                "category": "example",
                "type": " one of ['quest', 'challenge')",
            }
        ]
    },
    "token":
        "some token example",
}
```


----------------D-E-L-E-T-E---T-O-D-O------------

### deleteTodo

- Frontend Request
- Method: DELETE
- Link part: "/api/todos/:todoId",

**Header key**
- Authorization: "Bearer {{tokenExample}}"


**Response**

- 1 Opcja - No token in header:
- Response status: 401
- Response body: 
``` json
{
    "message": "correct authorization Header"
}
```

- 2 Opcja - Wrong token:
- Response status: 401
- Response body: 
``` json
{
    "message": "Not authorized"
}
```

- 3 Opcja - Authorization Error (no such user):
- Response status: 401
- Response body: 
``` json
{
    "message": "Not authorized"
}
```

- 4 Opcja - Todo not found:
- Response status: 404
- Response body: 
``` json
{
    "message": "Todo not found"
}
```

- 5 Opcja - Success:
- Response status: 200
- Response body: 
``` json
{
    "message": "Todo deleted"
}
```



--------S-E-T---T-O-D-O---S-T-A-T-U-S---D-O-N-E--------

### setTodoStatusDone

- Frontend Request
- Method: put
- Link part: "/api/todos/:todoId/finished",

**Header key**
- Authorization: "Bearer {{tokenExample}}"


**Response**

- 1 Opcja - No token in header:
- Response status: 401
- Response body: 
``` json
{
    "message": "correct authorization Header"
}
```

- 2 Opcja - Wrong token:
- Response status: 401
- Response body: 
``` json
{
    "message": "Not authorized"
}
```

- 3 Opcja - Authorization Error (no such user):
- Response status: 401
- Response body: 
``` json
{
    "message": "Not authorized"
}
```

- 4 Opcja - Todo not found:
- Response status: 404
- Response body: 
``` json
{
    "message": "Todo not found"
}
```

- 5 Opcja - Success:
- Response status: 200
- Response body: 
``` json
{
    "message": "Todo status updated to 'done' "
}
```


--------U-P-D-A-T-E---T-O-D-O--------

### updateTodo

- Frontend Request
- Method: put
- Link part: "/api/todos/:todoId",

**Header key**
- Authorization: "Bearer {{tokenExample}}"

**Request Body**
```json
{
    "title": "example",
    "difficulty": " one of ['easy', 'hard', 'normal']",
    "date": "21.01.2015",
    "time": "13:00:00",
    "status": " one of ['done', 'undone']",
    "category": "example",
    "type": " one of ['quest', 'challenge')",
}
```


**Response**

- 1 Opcja - No token in header:
- Response status: 401
- Response body: 
``` json
{
    "message": "correct authorization Header"
}
```

- 2 Opcja - Wrong token:
- Response status: 401
- Response body: 
``` json
{
    "message": "Not authorized"
}
```

- 3 Opcja - Authorization Error (no such user):
- Response status: 401
- Response body: 
``` json
{
    "message": "Not authorized"
}
```

- 4 Opcja - Data Validation Error:
- Response status: 400
- Response body: 
``` json
{
    "message": "{{Validation Error}}"
}
```

- 5 Opcja - Todo not found:
- Response status: 404
- Response body: 
``` json
{
    "message": "Todo not found"
}
```

- 6 Opcja - Success:
- Response status: 200
- Response body: 
``` json
{
    "message": "Todo updated"
}
```