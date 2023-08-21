# UT-USER-SERVICE

Service to manage users

## Getting Started

1. Clone repo
2. Navigate to directory and run `npm install`
3. Run `npm start`
4. Application should be running at http://localhost:3000

## Example

1. Creating user

```
curl -d '{"name":"<replace with valid user name>", "email":"<replace with valid email>"}' -H "Content-Type: application/json" -X POST http://localhost:3000/user
```

2. Find all users

```
curl --location --request GET 'http://localhost:3000/user'
```

3. Find a user

```
curl --location --request GET 'http://localhost:3000/user/<replace with valid id>'
```

4. update a user

```
curl --location --request PUT 'http://localhost:3000/user/<replace with valid id>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "age": 27
}'
```

5. delete a user

```
curl --location --request DELETE 'http://localhost:3000/user/<replace with valid id>'
```
