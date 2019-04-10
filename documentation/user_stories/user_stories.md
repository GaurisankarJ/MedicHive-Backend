# USER STORIES

## COMMON

#### INTERFACE

1. Should login user
2. Should guide user through resetting password if password is lost

#### EXPERIENCE

1. Login
    * Required
        1. email id
        2. password
2. Should initiate reset if user's password is lost
3. Should reset password with secret key and new password for user

---

## BUYER

#### INTERFACE

1. Should show if activated or not
2. Should show user information
3. Should guide the user through the requesting data from seller's
4. Should show all requests sent and their status
5. Should show all the received data
   1. Should have a query feature (`WHAT KIND OF QUERIES DOES THE BUYER NEED?`)
   2. Should have an export feature (`WHAT DATA FORMAT DOES THE BUYER NEED?`)

#### EXPERIENCE

1. Sign up
    * Required
        1. email id
        2. password
        3. user type  
    * Initiate activation process
        * ACTIVATION LOGIC (send activation mail) (`HOW DO WE VERIFY THE BUYER?`)
2. Enter user information (`WHAT BUYER INFORMATION DO WE NEED?`)
    * Required
        1. name
        2. address
    * Others
        1. bio
3. Update user information
    * Required
        1. user information type
        2. new payload
4. Logout
5. Re-initiate activation process
    * ACTIVATION LOGIC (send activation mail)
6. Request data once activated (`WHAT KIND OF DATA DOES THE BUYER NEED?`)
    * Required
        1. data type
    * Feature to track requests
7. View received data once activated
    * Data should include
        1. payload
        2. owner
        3. verifier
        4. data acquisition date
    * Feature to search data
    * Feature to export data as JSON

---

## SELLER

#### INTERFACE

1. Should show if activated or not
2. Should show user information
3. Should show the list of verifiers
4. Should guide the user through data addition
5. Should guide the user through data deletion
6. Should guide the user through data modification
7. Should guide the user through requesting data verification
8. Should guide the user through data sharing
9. Should show the users complete data
   1. Should show it's verification status and verifier email
   2. Should show it's shared status and buyer email

#### EXPERIENCE

1. Sign up
    * Required
        1. email id
        2. password
        3. user type  
    * Initiate activation process
        * ACTIVATION LOGIC (send activation mail) (`HOW DO WE VERIFY THE SELLER?`)
2. Enter user information
    * Required
        1. name
        2. address
    * Others
        1. age
        2. weight
        3. sex
        4. occupation
3. Update user information
    * Required
        1. user information type
        2. new payload
4. Logout
5. Re-initiate activation process
    * ACTIVATION LOGIC (send activation mail)
6. Add data
    * Required
        1. data type
        2. payload
7. Update data
    * Required
        1. unique data identifier
        2. new payload
8. Delete data
    * Required
        1. unique data identifier
9. View data
    * Data should include
        1. verified status
        2. verifier email
        3. shared status
        4. buyer email
    * Feature to add, delete and update data
    * Feature to search data
    * Feature to export data as JSON
10. Request data verification once activated
    * Required
        1. data type
        2. verifier email
    * Feature to track requests
11. View requests from buyers
    * Feature to track requests
12. Share data with buyer once activated
    * Required
        1. data type
        2. buyer email
    * Feature to track shared data

---

## VERIFIER/ISSUER

#### INTERFACE

1. Should show if activated or not
2. Should show user information
3. Should show the list of sellers
4. Should show verification requests
   1. Should show data requested for verification
5. Should guide the user through data addition
6. Should guide the user through data deletion
7. Should guide the user through data modification
8. Should guide the user through data sharing
9. Should show the users complete data
   1. Should show it's owner email

#### EXPERIENCE

1. Sign up
    * Required
        1. email id
        2. password
        3. user type  
    * Initiate activation process
        * ACTIVATION LOGIC (send activation mail) (`HOW DO WE VERIFY THE VERIFIER/ISSUER?`)
2. Enter user information
    * Required
        1. name
        2. address
    * Others
        1. bio
3. Update user information
    * Required
        1. user information type
        2. new payload
4. Logout
5. Re-initiate activation process
    * ACTIVATION LOGIC (send activation mail)
6. Add data
    * Required
        1. data type
        2. owner email
        3. payload
7. Update data
    * Required
        1. unique data identifier
        2. new payload
8. Delete data
    * Required
        1. unique data identifier
9. View data
    * Data should include
        1. owner email
        2. shared status
        3. seller email
    * Feature to add, delete and update data
    * Feature to search data
    * Feature to export data as JSON
10. View verification requests from sellers
    * Feature to track verification requests
    * View each requests payload
11. Verify data once activated
12. Share data with seller once activated
    * Required
        1. data type
        2. seller email
    * Feature to track shared data

---
---

> email ID's are unique identifiers