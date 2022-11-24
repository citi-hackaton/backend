# QRPP ARCH

## Database

### **Client**

| column name     | type   | unique | additional |
| --------------- | ------ | ------ | ---------- |
| id              | INT    | ✅     | *PK, *AI   |
| name            | STRING | ❌     |            |
| email           | STRING | ✅     |            |
| bankAccount     | STRING | ❌     |            |
| address         | STRING | ❌     |            |
| webhookEndpoint | STRING | ✅     |            |
| apiKey          | STRING | ✅     |            |

### **Bank**

| column name | type   | unique | additional |
| ----------- | ------ | ------ | ---------- |
| id          | INT    | ✅     | PK, AI     |
| name        | STRING | ✅     |            |
| bankCode    | STRING | ✅     |            |
| apiKey      | STRING | ✅     |            |

### **Transaction**

| Column name    | Type              | Unique | Additional                |
| -------------- | ----------------- | ------ | ------------------------- |
| id             | STRING            | ✅     | PK, \*UUID                |
| createdAt      | DATETIME          | ❌     | \*DEFAULT = Creation date |
| clientId       | INT               | ❌     | FK(Client)                |
| amount         | FLOAT             | ❌     |                           |
| description    | STRING            | ❌     |                           |
| expirationDate | DATETIME          | ❌     |                           |
| rejectability  | BOOLEAN           | ❌     |                           |
| status         | TransactionType\* | ❌     | DEFAULT = INITIAL         |

-   \***TransactionType**: INITIAL, PENDING, ACCEPTED, REJECTED, TIMED_OUT
-   \***PK**: Primary Key
-   \***AI**: Auto Increment
-   \***UUID**: Universally Unique Identifier
-   \***DEFAULT**: Default value

## Endpoints

We follow auth header structure: `Authorization: <type> <value>` defined in [RFC7234](https://www.rfc-editor.org/rfc/rfc7235#section-4.2) standard.

### **POST /qrPayments/initializeBusinessTransaction**

Used to initialize a transaction and return a transaction id.

`CLIENT` _(shop/payment provider)_ -> `SERVER` _(QRPP)_

**REQUEST**

Headers:

-   **Authorization**: X-QRPP-Api-Key _{KEY}_

Body:

```json
{
    "transactionData": {
        "amount": 100,
        "description": "Description of the transfer",
        "isRejectable": true
    }
}
```

**RESPONSE**

Body:

```json
{
    "transactionId": "TRANSACTION_ID"
}
```

---

### **POST /qrPayments/initializePersonalTransaction**

Used to initialize a transaction between two users and return a transaction id.

`BANK APP` -> `BANK API` -> `SERVER` _(QRPP)_

**REQUEST**

Headers:

-   **Authorization**: X-QRPP-Api-Key _{KEY}_

Body:

```json
{
    "transactionData": {
        "amount": 100,
        "bankAccount": "123456789",
        "description": "Description of the transfer"
    }
}
```

**RESPONSE**

Body:

```json
{
    "transactionId": "TRANSACTION_ID"
}
```

---

### **POST /qrPayments/validateTransaction**

Used to get the transaction data by `TRANSACTION_ID`.
Side effect: if the transaction is in `Initial` state, it will be set to `Pending`, otherwise will respond with error.

`BANK API` -> `SERVER` _(QRPP)_

**REQUEST**

Headers:

-   **Authorization**: X-QRPP-Api-Key _{KEY}_

Body:

```json
{
    "transactionId": "TRANSACTION_ID"
}
```

**RESPONSE**

Body:

```json
{
    "transactionData": {
        "amount": 100,
        "description": "Some description",
        "clientId": "Some client id",
        "clientName": "Some client name",
        "bankAccount": "Some bank account",
        "address": "Some address",
        "status": "PENDING"
    }
}
```

---

### **POST /qrPayments/updateTransactionStatus**

Used to **confirm**/**reject** the transaction by `TRANSACTION_ID`.

`BANK API` -> `SERVER` _(QRPP)_

**REQUEST**

Headers:

-   **Authorization**: X-QRPP-Api-Key _{KEY}_

Body:

```json
{
    "transactionId": "TRANSACTION_ID",
    "status": "ACCEPTED | REJECTED"
}
```

**RESPONSE**

Body:

```json
{
    "transactionId": "TRANSACTION_ID",
    "status": "ACCEPTED | REJECTED"
}
```

## Webhook

When transaction is accepted/rejected/timed out, QRPP will send a POST request to the webhook endpoint of the client.

**REQUEST**

Body:

```json
{
    "transactionId": "TRANSACTION_ID",
    "status": "ACCEPTED | REJECTED | TIMED_OUT"
}
```
