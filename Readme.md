#API Reference:

## self

### Get all shipment data of sent shipments (only clients)

`[GET]` `/api/v1/self/shipments/sent`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |

JSON response, expect an array of Object containing shipment data

### Get all shipment data of incoming shipments (only clients)

`[GET]` `/api/v1/self/shipments/incoming`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |

JSON response, expect an array of Object containing shipment data

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

### Delete country (supervisor only)

`[DELETE]` `/api/v1/country/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the country|

Empty response, expect just a simple 200 status message.

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

### Delete a city (supervisor only)

`[DELETE]` `/api/v1/city/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the city|

Empty response, expect just a simple 200 status message.


## cargo

### Get all cargo types

`[GET]` `/api/v1/cargos`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |

JSON response, expect an array of object with all the cargo types

### Add a new cargo type (supervisor only)

`[PUT]` `/api/v1/cargo`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|name|yes|encoded text|in body|the name of the cargo type (eg. food, electronics)|
|description|yes|encoded text|in body|the description of the cargo type|
|amount|yes|encoded text|in body|a float with refers to a cargo type charge|
|factor|yes|encoded text|in body|can only be '%' or '+' which refers to a multiplication value or adddition|

JSON response, expect a numeric id

### Update cargo name (supervisor only)

`[POST]` `/api/v1/cargo/:id/name`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the cargo type|
|name|yes|encoded text|in body|the new name|

Empty response, expect just a simple 200 status message.

### Update cargo description (supervisor only)

`[POST]` `/api/v1/cargo/:id/description`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the cargo type|
|description|yes|encoded text|in body|the new description|

Empty response, expect just a simple 200 status message.

### Update cargo amount (supervisor only)

`[POST]` `/api/v1/cargo/:id/amount`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the cargo type|
|amount|yes|encoded text|in body|the new amount as a float|

Empty response, expect just a simple 200 status message.

### Update cargo factor (supervisor only)

`[POST]` `/api/v1/cargo/:id/factor`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the cargo type|
|factor|yes|encoded text|in body|the new factor as '%' or '+'|

Empty response, expect just a simple 200 status message.

### Delete cargo type (supervisor only)

`[DELETE]` `/api/v1/cargo/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the cargo type|

Empty response, expect just a simple 200 status message.

## National Distance Prices

### Get all national price distance data

`[GET]` `/api/v1/npds`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |

JSON response, expect an array of object with data of an ID, price and distance

### Get an specific national price distance data

`[GET]` `/api/v1/npd/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the npd|

JSON response, Expect an object with data of an ID, price and distance

### Create a new npd (supervisor only)

`[PUT]` `/api/v1/npd`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|price|yes|encoded text| in body| the price as a float value|
|distance|yes|encoded text|in body| the distance as a float value|

JSON response, expect a numeric identifier

### Update an npd price (supervisor only)

`[POST]` `/api/v1/npd/:id/price`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the npd|
|price|yes|encoded text| in body| the price as a float value|

Empty response, expect just a simple 200 status message.

### Update an npd distance (supervisor only)

`[POST]` `/api/v1/npd/:id/distance`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the npd|
|distance|yes|encoded text|in body| the distance as a float value|

Empty response, expect just a simple 200 status message.

### Delete an npd (supervisor only)

`[DELETE]` `/api/v1/npd/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the npd|

Empty response, expect just a simple 200 status message.

### International Distance Prices

### Get all international price distance data

`[GET]` `/api/v1/ipds`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |

JSON response, expect an array of object with data of an ID, price and distance

### Get an specific international price distance data

`[GET]` `/api/v1/ipd/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the ipd|

JSON response, Expect an object with data of an ID, price and distance

### Create a new ipd (supervisor only)

`[PUT]` `/api/v1/ipd`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|price|yes|encoded text| in body| the price as a float value|
|distance|yes|encoded text|in body| the distance as a float value|

JSON response, expect a numeric identifier

### Update an ipd price (supervisor only)

`[POST]` `/api/v1/ipd/:id/price`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the ipd|
|price|yes|encoded text| in body| the price as a float value|

Empty response, expect just a simple 200 status message.

### Update an ipd distance (supervisor only)

`[POST]` `/api/v1/ipd/:id/distance`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the ipd|
|distance|yes|encoded text|in body| the distance as a float value|

Empty response, expect just a simple 200 status message.

### Delete an ipd (supervisor only)

`[DELETE]` `/api/v1/ipd/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the ipd|

Empty response, expect just a simple 200 status message.

## Duties

### Get all duties

`[GET]` `/api/v1/duties`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|country|no|encoded text|in querystring| the id of the country|

JSON response, expect an array of object with data of an ID, country, code, name, description and amount

### Get a specific duty

`[GET]` `/api/v1/duty/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url| the id of the duty|

JSON response, expect an object with data of an ID, country, code, name, description and amount

### Add a new duty (supervisor only)

`[PUT]` `/api/v1/duty`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|name|yes|encoded text|in body|a human readable name for the duty|
|description|yes|encoded text|in body|a human readable description|
|code|yes|encoded text|in body|the code of the duty|
|country|yes|encoded text|in body|the numeric identifier for the country|
|amount|yes|encoded text|in body|a float which is used to calculate the duty price by mutiplying with the value of the item|

JSON response, expect a numeric id

### Update duty name (supervisor only)

`[POST]` `/api/v1/duty/:id/name`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|name|yes|encoded text|in body|the new name|

Empty response, expect just a simple 200 status message.

### Update duty description (supervisor only)

`[POST]` `/api/v1/duty/:id/description`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|description|yes|encoded text|in body|the new description|

Empty response, expect just a simple 200 status message.

### Update duty amount (supervisor only)

`[POST]` `/api/v1/duty/:id/amount`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|amount|yes|encoded text|in body|the new amount|

Empty response, expect just a simple 200 status message.

### Delete an duty (supervisor only)

`[DELETE]` `/api/v1/duty/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the duty|

Empty response, expect just a simple 200 status message.

### Local Distance Prices

### Get all local price distance data

`[GET]` `/api/v1/lpds`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |

JSON response, expect an array of object with data of an ID, price and distance

### Get an specific local price distance data

`[GET]` `/api/v1/lpd/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the lpd|

JSON response, Expect an object with data of an ID, price and distance

### Create a new lpd (supervisor only)

`[PUT]` `/api/v1/lpd`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|price|yes|encoded text| in body| the price as a float value|
|distance|yes|encoded text|in body| the distance as a float value|

JSON response, expect a numeric identifier

### Update an lpd price (supervisor only)

`[POST]` `/api/v1/lpd/:id/price`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the lpd|
|price|yes|encoded text| in body| the price as a float value|

Empty response, expect just a simple 200 status message.

### Update an lpd distance (supervisor only)

`[POST]` `/api/v1/lpd/:id/distance`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the lpd|
|distance|yes|encoded text|in body| the distance as a float value|

Empty response, expect just a simple 200 status message.

### Delete an ipd (supervisor only)

`[DELETE]` `/api/v1/ipd/:id`

|Variable|required|type|method|description|
|:---------|:---------|:-------|:-------|:-------------------------|
|authtoken|yes|encoded text| in querystring | the auth token |
|id|yes|encoded text|in url|the id of the ipd|

Empty response, expect just a simple 200 status message.
