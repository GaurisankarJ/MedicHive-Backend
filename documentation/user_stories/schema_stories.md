# SCHEMA

## USER
```
{
    email: [string], // VALID EMAIL ID
    password: [string], // VALID PASSWORD (more then 6 characters)
    isActive: [boolean], // DEFAULT FALSE
    userType: [string], // VALID USER TYPE (b, s, v)
    confirmation: [
        {
        secret: [string] // VALID JWT TOKEN (unique user id, access, time)
        }
    ],
    tokens: [
        {
        access: [string], // VALID ACCESS (b-auth, s-auth, v-auth)
        token: [string], // VALID JWT TOKEN (unique user id, access, time)
        }
    ]
}
```

## DATA
```
{
    name: [string],
    address: [string],
    userType: [string], // VALID USER TYPE (b, s, v)
    message: {
        sent: [
            {
            // ACTION
            // [BUYER -> REQUEST]
            // [SELLER -> REQUEST, SHARE]
            // [VERIFIER -> VERIFY, SHARE]
            action: [string], // VALID ACTION
            // BODY
            // [BUYER -> SELLER ({ key: [string] })]
            // [SELLER -> VERIFIER ({ key: [string] }), BUYER ({ key: [string], count: [number] })]
            // [VERIFIER -> SELLER ({ key: [string], count: [number] })]
            body: [object] // VALID OBJECT
            // TO
            // [BUYER -> SELLERS]
            // [SELLER -> BUYER, VERIFIER]
            // [VERIFIER -> SELLER]
            to: [string], // VALID EMAIL ID
            time: [string]
            }
        ],
        received: [
            {
            // ACTION
            // [BUYER <- SHARE]
            // [SELLER <- REQUEST, VERIFY]
            // [VERIFIER <- REQUEST]
            action: [string], // VALID ACTION
            // BODY
            // [BUYER <- SELLERS ({ key: [string], count: [number] })]
            // [SELLER <- BUYER ({ key: [string] }), VERIFIER ({ key: [string], count: [number] })]
            // [VERIFIER <- SELLER ({ key: [string] })]
            body: [object] // VALID OBJECT
            // FROM
            // [BUYER <- SELLERS]
            // [SELLER <- BUYER, VERIFIER]
            // [VERIFIER <- SELLERS]
            from: [string], // VALID EMAIL ID
            time: [string]
            }
        ]
    },
    buyer: {
        bio: [string]
    },
    seller: {
        age: [string], // VALID AGE (greater than 0)
        weight: [string], // VALID WEIGHT (greater than 0)
        sex: [string], // VALID SEX (male, female)
        occupation: [string]
    },
    verifier: {
        bio: [string]
    },
    _creator: [string] // UNIQUE USER IDENTIFIER
}
```

## RECORD
```
{
    allergy: [
        {
            data: [string],
            owner: [
                {
                    email: [string], // VALID EMAIL ID
                    sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
                }
            ],
            verifier: [
                {
                    email: [string], // VALID EMAIL ID
                    sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
                }
            ],
            createdAt: [string],
            updatedAt: [string]
        }
    ],
    medication: [
        {
            data: [string],
            owner: [
                {
                    email: [string], // VALID EMAIL ID
                    sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
                }
            ],
            verifier: [
                {
                    email: [string], // VALID EMAIL ID
                    sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
                }
            ],
            createdAt: [string],
            updatedAt: [string]
        }
    ],
    problem: [
        {
            data: [string],
            owner: [
                {
                    email: [string], // VALID EMAIL ID
                    sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
                }
            ],
            verifier: [
                {
                    email: [string], // VALID EMAIL ID
                    sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
                }
            ],
            createdAt: [string],
            updatedAt: [string]
        }
    ],
    immunization: [
        {
            data: [string],
            owner: [
                {
                    email: [string], // VALID EMAIL ID
                    sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
                }
            ],
            verifier: [
                {
                    email: [string], // VALID EMAIL ID
                    sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
                }
            ],
            createdAt: [string],
            updatedAt: [string]
        }
    ],
    vital_sign: [
        {
            data: [string],
            owner: [
                {
                    email: [string], // VALID EMAIL ID
                    sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
                }
            ],
            verifier: [
                {
                    email: [string], // VALID EMAIL ID
                    sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
                }
            ],
            createdAt: [string],
            updatedAt: [string]
        }
    ],
    procedure: [
        {
            data: [string],
            owner: [
                {
                    email: [string], // VALID EMAIL ID
                    sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
                }
            ],
            verifier: [
                {
                    email: [string], // VALID EMAIL ID
                    sign: [string], // VALID JWT TOKEN (unique user id, unique record id, time)
                }
            ],
            createdAt: [string],
            updatedAt: [string]
        }
    ],
    log: [
        {
            // ACTION
            // BUYER -> REQUEST, DELETE
            // SELLER -> ADD, DELETE, UPDATE, VERIFY, SHARE
            // VERIFIER -> VERIFY, ADD, DELETE, UPDATE, SHARE
            action: [string],
            data: [object],
            createdAt: [string]
        }
    ],
    _creator: [string] // UNIQUE USER IDENTIFIER
}
```
