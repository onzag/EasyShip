#API Reference:

## self

### Get all shipment data of sent shipments (only clients)

`[GET]` `/api/v1/self/shipments/sent`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |

JSON response, expect an array of ID's

### Get all shipment data of incoming shipments (only clients)

`[GET]` `/api/v1/self/shipments/sent`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |

JSON response, expect an array of ID's

## country

### Get a list of countries

`[GET]` `/api/v1/countries`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |

JSON response, expect an array of object with properties of ID, name, long and lat

### Get a specific country

`[GET]` `/api/v1/country/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the country|

JSON response, expect an object with properties of ID, name, long and lat

### Update the location of the country in the map (Supervisor only)

`[POST]` `/api/v1/country/:id/location`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the country|
|long|yes|encoded text|in body|the new longitude as a float|
|lat|yes|encoded text|in body|the new latitude as a float|

Empty response, expect no response but a 200 status.

### Update the country name (Supervisor only)

`[POST]` `/api/v1/country/:id/name`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the country|
|name|yes|encoded text|in body|the new name|

Empty response, expect no response but a 200 status.

### Add a new country (Supervisor only)

`[PUT]` `/api/v1/country`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|name|yes|encoded text|in body|the name|
|long|yes|encoded text|in body|the longitude as a float|
|lat|yes|encoded text|in body|the latitude as a float|

JSON response, expect a number that represents the ID.

## city

### Get a list of cities

`[GET]` `/api/v1/cities`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|country|no|encoded text|in querystring|the id of the country that's parent of the city|

JSON response, expect an array of object with properties of ID, country, name, long and lat

### Get a specific city

`[GET]` `/api/v1/city/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the city|

JSON response, expect an object with properties of ID, name, long and lat

### Update the location of the city in the map (Supervisor only)

`[POST]` `/api/v1/city/:id/location`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the city|
|long|yes|encoded text|in body|the new longitude as a float|
|lat|yes|encoded text|in body|the new latitude as a float|

Empty response, expect no response but a 200 status.

### Update the city name (Supervisor only)

`[POST]` `/api/v1/country/:id/name`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the city|
|name|yes|encoded text|in body|the new name|

Empty response, expect no response but a 200 status.

### Update the city's country (Supervisor only)

`[POST]` `/api/v1/city/:id/country`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the city|
|country|yes|encoded text|in body|the country's id parent|

Empty response, expect no response but a 200 status.

### Add a new city (Supervisor only)

`[PUT]` `/api/v1/city`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|country|yes|encoded text|in body|the parent country's id|
|name|yes|encoded text|in body|the name|
|long|yes|encoded text|in body|the longitude as a float|
|lat|yes|encoded text|in body|the latitude as a float|

JSON response, expect a number that represents the ID.
