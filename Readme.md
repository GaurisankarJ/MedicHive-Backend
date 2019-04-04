# USERS

### SIGN UP USER
>  Handle creating a user account.
* **URL**
  /users
* **Method:**
  `POST`
* **Headers**
* **URL Params**
* **Query Params**
* **Data Params**
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
	\"email\": \"example@example.com\",
	\"password\": \"password\",
	\"userType\": \"b\"
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
  /users
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
  ***Required:*** 
  ```
  userType = USER TYPE
  ```
  ***Constraints:*** 
  * User type must be b/s/v or B/S/V.
* **Query Params**
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
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request GET "{{url}}/users?userType=s" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: application/json" \
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
  /users
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
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request DELETE "{{url}}/users" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: {{x-auth}}" \
  ```
* **Notes:**
***

### UPDATE USER
>  Handle updating a user account.
* **URL**
  /users
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
    	"message": "KEY reset",
    	"email": VALID EMAIL ID
    }
    ```
* **Error Response:**
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
    "message": "email reset",
    "email": "example@example.com"
  }
  ```
* **Notes:**
***

### LOG IN USER
>  Handle logging into a user account.
* **URL**
  /users/login
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
