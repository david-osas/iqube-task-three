# Revie

  Welcome to the API documentation for Revie. This API allows your to create/post reviews about apartments, view all reviews, view a review using its ID, mark a review as helpful, sort reviews based on most helpful or most recent reviews, and delete a review using its ID.

## API allowable actions

### Create a review
  To create a review make a POST request to 
  ```
  https://revie-api.herokuapp.com/create-review
  ```
  and pass the review data as form data to the body property in your request
  The form data must be structured as follows
  
  | key | value |
  | ------------- | ------------- |
  | landlords | review of the apartment landlord(s) in string data type |
  | environment | review of the apartment environment in string data type |
  | amenities | review of the apartment amenities in string data type |
  | location | address of the apartment |
  | [any media file] | [blob data of media file showcasing the apartment] |
  
  One or more media files can be added to the form data.
  If the review has been created successfully, you will get the string response shown below with status code 200
  ```
  review has been successfully created
  ```
  
### View all reviews
To view all reviews make a GET request to 
```
https://revie-api.herokuapp.com/all-reviews
```
An array of JavaScript objects is returned in JSON format as the api response. An example format is shown below
```
[
    {
        "id": "9feade87-fb3c-4fea-96a2-67e0e29c04e1",
        "data": {
            "landlords": "dummy",
            "amenities": "dummy",
            "location": "dummy",
            "media": [
                {
                    "id": "upload_1f5f890b680b061de1befef0e5804924.jpg",
                    "url": "https://storage.googleapis.com/revie-7ea35.appspot.com/upload_1f5f890b680b061de1befef0e5804924.jpg"
                }
            ],
            "environment": "dummy",
            "timestamp": "2021-01-06T17:27:06.867Z",
            "helpful": 0
        }
    }
]
```
If you want to get reviews sorted based on most helpful, make a GET request to this url
```
https://revie-api.herokuapp.com/all-reviews?organize=helpful
```
If you want to get reviews sorted based on most recent, make a GET request to this url
```
https://revie-api.herokuapp.com/all-reviews?organize=recent
```

### Get one review
To get one review, make a GET request to the this url
```
https://revie-api.herokuapp.com/one-review
```
and pass a key-value object to the body property in your request. The object should contain an `id` property which contains the ID of the review being requested.
An example of the api response is shown below
```
{
    "landlords": "dummy",
    "timestamp": "2021-01-06T17:27:06.867Z",
    "amenities": "dummy",
    "environment": "dummy",
    "location": "dummy",
    "media": [
        {
            "url": "https://storage.googleapis.com/revie-7ea35.appspot.com/upload_1f5f890b680b061de1befef0e5804924.jpg",
            "id": "upload_1f5f890b680b061de1befef0e5804924.jpg"
        }
    ],
    "helpful": 0
}
```

### Mark as helpful
To mark a review as helpful, make a PATCH request to 
```
https://revie-api.herokuapp.com/helpful-review
```
and pass a key-value object to the body property in your request. The object should contain an `id` property which contains the ID of the review being marked.
If the review has been marked helpful successfully, you will get the string response shown below with status code 200
```
review has been successfully marked helpful
```

### Delete a review

To delete a review, make a DELETE request to 
```
https://revie-api.herokuapp.com/delete-review
```
and pass a key-value object to the body property in your request. The object should contain an `id` property which contains the ID of the review being marked.
If the review has been deleted successfully, you will get the string response shown below with status code 200
```
review has been successfully deleted
```


