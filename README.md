# Brazil Japan Joint Team Blog API

## Routes

| Name                   | Route                  | Type | Description                                                   |
|------------------------|------------------------|------|:--------------------------------------------------------------|
| User Login             | /api/auth/login        | GET  | Logs the user into the application and create a token         |
| Test JWT Token         | /api/auth/jwt-test     | GET  | Check if the bearer token is linked to a user in the database |
| User Signup            | /api/auth/signup       | POST | Sign the user up and create a token                           |                                 
| Get User By ID         | /api/user/:userId      | GET  | Get user by id and return the result                          |
| Get posts by User ID   | /api/user/:userId      | GET  | Get all blog posts by user ID                                 |
| Create Post by User ID | /api/user/:userId/post | POST | Create a blog post and insert it into a user entry by ID      |

## Next steps

- [ ] Convert the route based configuration into a controller-router based one (it's a mess right now)
- [ ] Find a way to shorten API URLs, standard MongoDB IDs are very long and look ugly
- [ ] Make it so that endpoints cannot be reached unless the user is logged in and possesses a valid JSON Web
 Token, JWT should be available for 30 days
- [ ] Create additional routes to make the API more functional
- [ ] Test the API using mocks with Jest with the above specifications
- [ ] Hook it up to the frontend

## Setup for Development

- Clone the project using `git clone https://github.com/Metallifax/bjjt-blog-backend`
- Make sure a working MongoDB database is running on your system
  - [Windows](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)
  - [Linux](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-debian/)
  - [Mac](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)
- Install Node packages with either `npm install` or `yarn`
- Start the local server using `npm run dev`
- Try out the routes in either [Postman](https://www.postman.com/) or other API testing software

