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

**transaction**

- id
- client_id
- amount
- date
- description
- expiring_date
- status

## Endpoints

We follow auth header structure: Authorization: <type> <value> defined in [RFC7234](https://www.rfc-editor.org/rfc/rfc7235#section-4.2) standard.

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
    "description": "Some description",
  }
}
```

**RESPONSE**

Body:
```json
{
  "qrCode": "base64 encoded image containing SESSION_ID"
}
```

### POST /getTransactionData

Used to get the transaction data by *SESSION_ID*.

BANK API -> SERVER (QRPP)

**REQUEST**

Headers:
- **Authorization**: X-QRPP-Api-Key *{KEY}*

Body:
```json
{
  "sessionId": "SESSION_ID"
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

### POST /updateTransactionStatus

Used to confirm/reject the transaction by *SESSION_ID*.

BANK API -> SERVER (QRPP)

**REQUEST**

Headers:
- **Authorization**: X-QRPP-Api-Key *{KEY}*

Body:
```json
{
  "sessionId": "SESSION_ID",
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
