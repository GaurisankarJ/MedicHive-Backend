# RECORDS

### CREATE USER RECORD
>  Handle creating record of a user.
* **URL**
  /record
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
* **Data Params**
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    { 
      message : "record created",
      email: VALID EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
* **Sample Call:**
  ```
  curl --location --request POST "{{url}}/record" \
  --header "x-auth: {{x-auth}}"
  ```
* **Sample Response:**
  ```
  { 
    message : "record created",
    email: "seller@example.com"
  }
  ```
* **Notes:**
***

### GET USER RECORD
>  Handle fetching record of a user.
* **URL**
  /record
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
    "record": {
        "allergy": ALLERGY ARRAY,
        "medication": MEDICATION ARRAY,
        "problem": PROBLEM ARRAY,
        "immunization": IMMUNIZATION ARRAY,
        "vital_sign": VITAL SIGN ARRAY,
        "procedure": PROCEDURE ARRAY
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
  curl --location --request GET "{{url}}/record" \
  --header "x-auth: {{x-auth}}"
  ```
* **Sample Response:**
  ```
  {
    "record": {
        "allergy": [],
        "medication": [],
        "problem": [],
        "immunization": [],
        "vital_sign": [],
        "procedure": []
    },
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***

### DELETE USER RECORD
>  Handle deleting record of a user.
* **URL**
  /record
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
  curl --location --request DELETE "{{url}}/record" \
  --header "x-auth: {{x-auth}}"
  ```
* **Sample Response:**
* **Notes:**
***

### UPDATE USER RECORD
>  Handle updating record of a user.
* **URL**
  /record
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
    value: VALID VALUES ARRAY
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
  curl --location --request PATCH "{{url}}/record" \
  --header "Content-Type: application/json" \
  --header "x-auth: {{x-auth}}" \
  --data "{
	\"key\": \"allergy\",
	\"value\": [\"allergy1\", \"allergy2\"]
  }"
  ```
* **Sample Response:**
  ```
  {
    "message": "allergy updated",
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***

### DELETE USER RECORD ELEMENT
>  Handle deleting record element of a user.
* **URL**
  /record/:id
* **Method:**
  ```
  DELETE
  ```
* **Headers** <br />
  ***Required:*** 
  ```
  x-auth
  ```
* **URL Params** <br />
  ***Required:*** 
  ```
  id = VALID RECORD ELEMENT ID
  ```
* **Query Params**
* **Data Params**
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    {
    	"message": "record deleted",
    	"email": VALID EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request DELETE "{{url}}/record/{{id}}" \
  --header "x-auth: {{x-auth}}"
  ```
* **Sample Response:**
  ```
  {
    "message": "record deleted",
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***

### UPDATE USER RECORD ELEMENT
>  Handle updating record element of a user.
* **URL**
  /record/:id
* **Method:**
  ```
  PATCH
  ```
* **Headers** <br />
  ***Required:*** 
  ```
  x-auth
  ```
* **URL Params** <br />
  ***Required:*** 
  ```
  id = VALID RECORD ELEMENT ID
  ```
* **Query Params**
* **Data Params** <br />
  ***Payload:***
  ```
  {
    value: VALID VALUE
  }
  ```
* **Success Response:** 
  * ***Code:*** 
      200
  * ***Content:***
    ```
    {
    	"message": "record updated",
    	"email": VALID EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request PATCH "{{url}}/record/{{id}}" \
  --header "Content-Type: application/json" \
  --header "x-auth: {{x-auth}}" \
  --data "{
	\"value\": \"new allegry\"
  }"
  ```
* **Sample Response:**
  ```
  {
    "message": "record updated",
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***
