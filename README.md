[![Build Status](https://app.travis-ci.com/IdasLam/jsramverk-api.svg?branch=master)](https://app.travis-ci.com/IdasLam/jsramverk-api)

# JSramverk-API
This api is used in course DV1612 H21 lp1 at BTH.


## API Routes

| Routes    | Type    | Description           |
| ------------------ |:---------------------|:---------------------|
| `/`             |   `GET`   | Returns data with 'Hello World'|
| `/document/all` |   `GET`     | Returns data with all of the documents created |
| `/document/find` |   `POST`  | Will find document with the same `id` |
| `/document/save` |   `POST`  | Will find save title and content with the `id`, if not already in the database it will create and save the new document |
| `/document/delete` |   `POST`  | Will delete document with `id` |



## Installation & Start
The following steps are needed to get the API working.

```
npm i
npm i -g nodemon OR npm i -D nodemon
```

### `development`:
```
npm run dev
```
The api will open on port 1337.


### `production`:
```
npm run build
npm run start
```
