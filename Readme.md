# COMMUNICATION

### BUYER: REQUEST DATA FROM SELLERS
>  Handle requesting record element of sellers, by a buyer.
* **URL**
  /request/b
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
  ***Payload:***
  ```
  {
    "key": VALID KEY
  }
  ```
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    { 
      "message" : "KEY requested successfully",
      "email": VALID BUYER EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request POST "{{url}}/request/b" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: application/json" \
  --data "{
	\"key\": \"allergy\"
  }"
  ```
* **Sample Response:**
  ```
  { 
    "message" : "allergy requested successfully",
    "email": "buyer@example.com"
  }
  ```
* **Notes:**
***

### SELLER: SHARE DATA WITH BUYER
>  Handle sharing a record element of a seller, to a buyer, by a seller.
* **URL**
  /share/s
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
  ***Payload:***
  ```
  {
    "key": VALID KEY,
    "buyerEmail": VALID BUYER EMAIL ID
  }
  ```
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    { 
      "message" : "COUNT KEY shared successfully",
      "count": COUNT OF KEYS SHARED
      "email": VALID SELLER EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request POST "{{url}}/share/s" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: application/json" \
  --data "{
	\"key\": \"allergy\",
	\"buyerEmail\": \"buyer@example.com\"
  }"
  ```
* **Sample Response:**
  ```
  { 
    "message" : "2 allergy shared successfully",
    "count": 2,
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***

### SELLER: REQUEST DATA FROM VERIFIER
>  Handle requesting a record element of a seller, from a verifier, by a seller.
* **URL**
  /request/s
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
  ***Payload:***
  ```
  {
    "key": VALID KEY,
    "verifierEmail": VALID VERIFIER EMAIL ID
  }
  ```
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    { 
      "message" : "KEY requested successfully",
      "email": VALID SELLER EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request POST "{{url}}/request/s" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: application/json" \
  --data "{
	\"key\": \"allergy\",
	\"verifierEmail\": \"verifier@example.com\"
  }"
  ```
* **Sample Response:**
  ```
  { 
    "message" : "allergy requested successfully",
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***

### SELLER: REQUEST DATA VERIFICATION FROM VERIFIER
>  Handle requesting verification of a record element of a seller, from a verifier, by a seller.
* **URL**
  /verify/s
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
  ***Payload:***
  ```
  {
    "key": VALID KEY,
    "verifierEmail": VALID VERIFIER EMAIL ID
  }
  ```
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    { 
      "message" : "verification requested successfully",
      "email": VALID SELLER EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request POST "{{url}}/verify/s" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: application/json" \
  --data "{
	\"key\": \"allergy\",
	\"verifierEmail\": \"verifier@example.com\"
  }"
  ```
* **Sample Response:**
  ```
  { 
    "message" : "verification requested successfully",
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***

### VERIFIER: SHARE DATA WITH SELLER
>  Handle sharing a record element of a seller held by the verifier, to a seller, by a verifier.
* **URL**
  /share/v
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
  ***Payload:***
  ```
  {
    "key": VALID KEY,
    "sellerEmail": VALID SELLER EMAIL ID
  }
  ```
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    { 
      "message" : "COUNT KEY shared successfully",
      "count": COUNT OF RECORDS SHARED
      "email": VALID SELLER EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request POST "{{url}}/share/v" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: application/json" \
  --data "{
	\"key\": \"allergy\",
	\"sellerEmail\": \"seller@example.com\"
  }"
  ```
* **Sample Response:**
  ```
  { 
    "message" : "3 medication shared successfully",
    "count: 3,
    "email": "seller@example.com"
  }
  ```
* **Notes:**
***

### VERIFIER: GET DATA FROM SELLER TO VERIFY
>  Handle fetching for verification a record element of a seller, from a seller, by a verifier.
* **URL**
  /verify/v
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
  ***Required:*** 
  ```
  id = VALID MESSAGE ID
  ```
* **Data Params**
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    { 
      "record": SELLER RECORD ELEMENT ARRAY TO VERIFY,
      "seller": VALID SELLER EMAIL ID,
      "email": VALID VERIFIER EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request GET "{{url}}/verify/v?=id{{id}}" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: application/json"
  ```
* **Sample Response:**
  ```
  { 
    "record": [],
    "seller": "seller@example.com",
    "email": "verifier@example.com"
  }
  ```
* **Notes:**
***

### VERIFIER: VERIFY RECORD DATA OF SELLER
>  Handle verification of a record element of a seller, by a verifier.
* **URL**
  /verify/v
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
  ***Payload:***
  ```
  {
    "key": VALID KEY,
    "sellerEmail": VALID SELLER EMAIL ID
  }
  ```
* **Success Response:**
  * ***Code:*** 200
  * ***Content:***
    ```
    { 
      "message" : "COUNT KEY verified successfully",
      "count": COUNT OF RECORDS VERIFIED
      "email": VALID SELLER EMAIL ID
    }
    ```
* **Error Response:**
  * ***Code:*** 401 NOT AUTHORIZED
  * ***Code:*** 400 BAD REQUEST
  * ***Code:*** 404 NOT FOUND
* **Sample Call:**
  ```
  curl --location --request POST "{{url}}/verify/v" \
  --header "x-auth: {{x-auth}}" \
  --header "Content-Type: application/json" \
  --data "{
	\"key\": \"procedure\",
	\"sellerEmail\": \"seller@example.com\"
  }"
  ```
* **Sample Response:**
  ```
  { 
    "message" : "4 procedure verified successfully",
    "count": 4
    "email": "verifier@example.com"
  }
  ```
* **Notes:**
***
