# USERS

### SIGN UP USER
>  Handle creating a user account.
* **URL**
  ```
  /users
  ```
* **Method:**
  ```
  POST
  ```
* **Headers**
* **URL Params**
* **Query Params**
* **Data Params** <br />
  ***Payload:***
  ```
  {
    email: VALID EMAIL ID,
    password: VALID PASSWORD,
    userType: VALID USER TYPE
  }
  ```
  ***Constraints:***
  * Email must be valid.
  * Password must be longer than 5 words.
  * User type must be b/s/v or B/S/V.
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    {
      email : VALID EMAIL ID,
      userType: VALID USER TYPE 
    }
    ```
* **Error Response:**
  * ***Code:*** 400 BAD REQUEST <br />
* **Sample Call:**
  ```
  curl --location --request POST "{{url}}/users" \
  --header "Content-Type: application/json" \
  --data "{
	\"email\": \"seller@example.com\",
	\"password\": \"password\",
	\"userType\": \"s\"
  	}"
  ```
* **Sample Response:**
  ```
  {
    "email": "seller@example.com",
    "userType": "s"
  }
  ```
* **Notes:**
***

### GET USERS
>  Handle fetching users of a specific user type.
* **URL**
  ```
  /users
  ```
* **Method:**
  ```
  GET
  ```
* **Headers** <br />
  ***Required:*** 
  ```
  x-auth
  ```
* **URL Params**
* **Query Params** <br />
  ***Required:*** 
  ```
  userType = USER TYPE
  ```
  ***Constraints:*** 
  * User type must be b/s/v or B/S/V.
* **Data Params**
* **Success Response:**
  * ***Code:*** 
      200
  * ***Content:***
    ```
    {
      "userType": VALID USER TYPE,
      "users": [
        {
          "email": VALID EMAIL ID,
          "userType": VALID USER TYPE
        }
      ]
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request GET "{{url}}/users?userType=s" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: application/json"
  ```
* **Sample Response:**
  ```
  {
    "userType": "s",
    "users": [
        {
            "email": "seller@example.com",
            "userType": "s"
        }
    ]
  }
  ```
* **Notes:**
***

### DELETE USER
>  Handle deleting a user account.
* **URL**
  ```
  /users
  ```
* **Method:**
  ```
  DELETE
  ```
* **Headers** <br />
  ***Required:***
  ```
  x-auth
  ```
* **URL Params**
* **Query Params**
* **Data Params**
* **Success Response:**
  * ***Code:*** 200
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request DELETE "{{url}}/users" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: {{x-auth}}"
  ```
* **Sample Response:**
* **Notes:**
***

### UPDATE USER
>  Handle updating a user account.
* **URL**
  ```
  /users
  ```
* **Method:**
  ```
  PATCH
  ```
* **Headers** <br />
  ***Required:*** 
  ```
  x-auth
  ```
* **URL Params**
* **Query Params**
* **Data Params** <br />
  ***Payload:***
  ```
  {
    key: VALID KEY,
    value: VALID VALUE
  }
  ```
  ***Constraints:***
  * Key must be valid.
  * Value must be valid.
* **Success Response:**
  * ***Code:***
      200
  * ***Content:***
    ```
    {
      "message": "KEY updated",
      "email": VALID EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
* **Sample Call:**
  ```
  curl --location --request PATCH "{{url}}/users" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: application/json" \
  --data "{
	\"key\": \"email\",
	\"value\": \"example@example.com\"
  	}"
  ```
* **Sample Response:**
  ```
  {
    "message": "email updated",
    "email": "example@example.com"
  }
  ```
* **Notes:**
***

### LOG IN USER
>  Handle logging into a user account.
* **URL**
  ```
  /users/login
  ```
* **Method:**
  ```
  POST
  ```
* **Headers**
* **URL Params**
* **Query Params**
* **Data Params** <br />
  ***Payload:***
  ```
  {
    email: VALID EMAIL ID,
    password: VALID PASSWORD
  }
  ```
  ***Constraints:***
  * Email must be valid.
  * Password must be valid.
* **Success Response:**
  * ***Code:*** 
      200
  * ***Content:***
    ```
    { 
      email : VALID EMAIL ID,
      userType: VALID USER TYPE 
    }
    ```
  * ***Header:***
    ```
    x-auth
    ```
* **Error Response:**
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request POST "{{url}}/users/login" \
  --header "Content-Type: application/json" \
  --data "{
	\"email\": \"seller@example.com\",
	\"password\": \"password\"
  	}"
  ```
* **Sample Response:**
  ```
  {
    "email": "seller@example.com",
    "userType": "s"
  }
  ```
* **Notes:**
***

### LOG OUT USER
>  Handle logging out of a user account.
* **URL**
  ```
  /users/logout
  ```
* **Method:**
  ```
  DELETE
  ```
* **Headers** <br />
  ***Required:*** 
  ```
  x-auth
  ```
* **URL Params**
* **Query Params**
* **Data Params**
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    { 
      message : "logout successful",
      email: VALID EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
* **Sample Call:**
  ```
  curl --location --request DELETE "{{url}}/users/logout" \
  --header "x-auth: {{x-auth}}"
  ```
* **Sample Response:**
  ```
  {
    "message": "logout successful",
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***

### SEND ACTIVATION MAIL TO USER
>  Handle sending activation mail.
* **URL**
  ```
  /users/activate
  ```
* **Method:**
  ```
  GET
  ```
* **Headers** <br />
  ***Required:*** 
  ```
  x-auth
  ```
* **URL Params**
* **Query Params**
* **Data Params**
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    {
      message: "activation mail sent successfully",
      email: VALID EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
* **Sample Call:**
  ```
  curl --location --request GET "{{url}}/users/activate" \
  --header "x-auth: {{x-auth}}"
  ```
* **Sample Response:**
  ```
  {
    message: "activation mail sent successfully",
    email: seller@example.com
  }
  ```
* **Notes:**
***

### ACTIVATE USER
>  Handle activating a user account.
* **URL**
  ```
  /users/activate/:secret
  ```
* **Method:**
  ```
  POST
  ```
* **Headers**
* **URL Params** <br />
  ***Required:*** 
  ```
  secret = VALID SECRET
  ```
* **Query Params**
* **Data Params**
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    {
      "message": "activated successfully",
      "email": VALID EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 400 BAD REQUEST
* **Sample Call:**
  ```
  curl --location --request POST "{{url}}/users/activate/{{secret}}"
  ```
* **Sample Response:**
  ```
  {
    "message": "activated successfully",
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***

### SEND FORGOT PASSWORD MAIL TO USER
>  Handle sending forgot password mail.
* **URL**
  ```
  /users/forgot
  ```
* **Method:**
  ```
  GET
  ```
* **Headers**
* **URL Params**
* **Query Params** <br />
  ***Required:***
  ```
  email = VALID EMAIL ID
  ```
* **Data Params**
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    {
      "message": "password reset mail sent successfully",
      "email": VALID EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request GET "{{url}}/users/forgot?email={{email}}" \
  --header "Content-Type: application/json"
  ```
* **Sample Response:**
  ```
  {
    "message": "password reset mail sent successfully",
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***

### RESET PASSWORD FOR FORGOT PASSWORD
>  Handle changing password of a user account for forgot password.
* **URL**
  ```
  /users/forgot/:secret
  ```
* **Method:**
  ```
  POST
  ```
* **Headers**
* **URL Params** <br />
  ***Required:***
  ```
  secret = VALID SECRET
  ```
* **Query Params**
* **Data Params** <br />
  ***Required:***
  ```
  {
    password: VALID NEW PASSWORD
  }
  ```
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    {
      "message": "password reset successfully",
      "email": VALID EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 400 BAD REQUEST
* **Sample Call:**
  ```
  curl --location --request POST "{{url}}/users/forgot/{{secret}}" \
  --header "Content-Type: application/json" \
  --data "{
    \"password\": \"new password\"
  }"
  ```
* **Sample Response:**
  ```
  {
    "message": "password reset successfully",
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***