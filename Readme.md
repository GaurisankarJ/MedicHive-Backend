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
  * ***Code:*** 200 <br />
    ***Content:*** <br /> 
    ```
    { email : VALID EMAIL ID, userType: VALID USER TYPE }
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
* **Headers**
   ***Required:*** 
   ```
   x-auth
   ```
* **URL Params** <br />
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
      200 <br />
    ***Content:*** <br />
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
  * ***Code:*** 400 BAD REQUEST <br />
  * ***Code:*** 404 NOT FOUND <br />
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
* **Headers**
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
  * ***Code:*** 400 BAD REQUEST <br />
  * ***Code:*** 404 NOT FOUND <br />
* **Sample Call:**
  ```
  curl --location --request DELETE "{{url}}/users" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: {{x-auth}}" \
  ```
* **Notes:**
***

