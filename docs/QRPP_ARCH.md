# QRPP ARCH

## Database

### Tables

**client**

- id
- name
- email
- api_key
- bank_account
- address
- webhook_endpoint

**bank**

- id
- name
- bank_code
- api_key

**transaction**

- id
- client_id
- amount
- date
- description
- expiring_date
- status

## Endpoints

We follow auth header structure: `Authorization: <type> <value>` defined in [RFC7234](https://www.rfc-editor.org/rfc/rfc7235#section-4.2) standard.

### POST /generateQrCode

Used to generate a QR code with the given transaction data.

CLIENT (shop/payment provider) -> SERVER (QRPP)

**REQUEST**

Headers:
- **Authorization**: X-QRPP-Api-Key *{KEY}*

Body:
```json
{
  "transactionData": {
    "amount": 100,
    "description": "Some description"
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

### POST /generatePersonalQrCode

Used to generate a QR code with the given transaction data.

BANK APP -> BANK API -> SERVER (QRPP)

**REQUEST**

Headers:
- **Authorization**: X-QRPP-Api-Key *{KEY}*

Body:
```json
{
  "transactionData": {
    "amount": 100,
    "bank_account": "123456789",
    "description": "Some description"
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

### POST /getTransactionData

Used to get the transaction data by *TRANSACTION_ID*.

BANK API -> SERVER (QRPP)

**REQUEST**

Headers:
- **Authorization**: X-QRPP-Api-Key *{KEY}*

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
    "client_id": "Some client id",
    "client_name": "Some client name",
    "bank_account": "Some bank account",
    "address": "Some address"
  }
}
```

---

### POST /updateTransactionStatus

Used to confirm/reject the transaction by *TRANSACTION_ID*.

BANK API -> SERVER (QRPP)

**REQUEST**

Headers:
- **Authorization**: X-QRPP-Api-Key *{KEY}*

Body:
```json
{
  "transactionId": "TRANSACTION_ID",
  "action": "confirm/reject"
}
```

**RESPONSE**

Body:
```json
{
  "status": "OK"
}
```

## Webhook

When transaction is accepted/rejected/timed out, QRPP will send a POST request to the webhook endpoint of the client.

**REQUEST**

Body:
```json
{
  "transactionId": "TRANSACTION_ID",
  "action": "accepted/rejected/timed_out"
}
```
