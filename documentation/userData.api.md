# USERS DATA

### CREATE USER DATA
>  Handle creating user data of a user.
* **URL**
  /users/me
* **Method:**
  ```
  POST
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
	"name": NAME,
	"address": ADDRESS,
	"seller": {
		"age": VALID AGE,
		"weight": VALID WEIGHT,
		"sex": VALID SEX,
		"occupation": OCCUPATION
	}
  }
  ```
  ***Constraints:***
  * Age must be valid, greater than 0.
  * Weight must be valid, greater than 0.
  * Sex must be male or female.
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    { 
      message : "user created",
      email: VALID EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
* **Sample Call:**
  ```
  curl --location --request POST "{{url}}/users/me" \
  --header "Content-Type: application/json" \
  --header "x-auth: {{x-auth}}" \
  --data "{
	\"name\": \"name\",
	\"address\": \"my address\",
	\"seller\": {
		\"age\": 22,
		\"weight\": 100,
		\"sex\": \"male\",
		\"occupation\": \"job\"
	}
  }"
  ```
* **Sample Response:**
  ```
  { 
    message : "user created",
    email: "seller@example.com"
  }
  ```
* **Notes:**
***

### GET USER DATA
>  Handle fetching user data of a user.
* **URL**
  /users/me
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
  * ***Code:*** 
      200
  * ***Content:***
    ```
    {
    "userData": {
        "name": NAME,
        "address": ADDRESS,
        "userType": VALID USER TYPE,
        "seller": {
            "age": VALID AGE,
            "weight": VALID WEIGHT,
            "sex": VALID SEX,
            "occupation": OCCUPATION
        }
    },
    "email": VALID EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request GET "{{url}}/users/me" \
  --header "x-auth: {{x-auth}}"
  ```
* **Sample Response:**
  ```
  {
    "userData": {
        "name": "Seller Name",
        "address": "Seller Address",
        "userType": "s",
        "seller": {
            "age": 22,
            "weight": 100,
            "sex": "male",
            "occupation": "Seller Occupation"
        }
    },
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***

### DELETE USER DATA
>  Handle deleting user data of a user.
* **URL**
  /users/me
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
  curl --location --request DELETE "{{url}}/users/me" \
  --header "x-auth: {{x-auth}}"
  ```
* **Sample Response:**
* **Notes:**
***

### UPDATE USER DATA
>  Handle updating user data of a user.
* **URL**
  /users/me
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
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request PATCH "{{url}}/users/me" \
  --header "Content-Type: application/json" \
  --header "x-auth: {{x-auth}}" \
  --data "{
	\"key\": \"name\",
	\"value\": \"new name\"
  }"
  ```
* **Sample Response:**
  ```
  {
    "message": "name updated",
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***

### GET MESSAGE'S OF USERS
>  Handle fetching messages of a user.
* **URL**
  /message/me
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
  * ***Code:*** 
      200
  * ***Content:***
    ```
    { 
      "sent": SENT MESSAGES ARRAY, 
      "received": RECEIVED MESSAGES ARRAY, 
      "email": VALID EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request GET "{{url}}/message/me" \
  --header "x-auth: {{x-auth}}"
  ```
* **Sample Response:**
  ```
  { 
    "sent": [], 
    "received": [], 
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***
