## Elevate - Above the Ordinary!

### Backend Side

Basic Server setup with copilot AI help.

Schema and Model ready for Role Based Authentication (buyer and seller)

APIs for Registration and Authentication and also need to integrate to Frontend side as well

- Controllers
- Routes

Express Validation as a middleware will be used between request path ---and--- the controller logic

Inside controller logic

- existing user check
- if not proceeding ahead in registering a new user
- for that, the database, token, password hashing (performing hash inside userModel) all will be needed.

## Frontend Side

Now creating a frontend folder and using Google Stitch for UI design via MCP server connection in AntiGravity IDE

And installing inside the folder with -> npm create vite@latest .

- then installing -> npm i tailwindcss @tailwind/vite
- Importing tailwindcss from '@tailwindcss/vite'
- And calling inside the plugins

Performing Clean needed react setup

Now installing redux toolkit -> npm i @reduxjs/toolkit react-redux

- Then setting up states like user, loading and error

Now after this creating backend service api file in features folder

Installing -> npm i axios

Integrating APIs for Backend to INTERACT with the Frontend using axios

Building the logic inside the Register and Logic components from scratch using Snitch tool MCP server.

States need to be managed as well over the Frontend side -

- Inside `auth.api.js` will return RESPONSE like response.data
- Then, inside hook `useAuth.js` that API response containing that same data will be DISPATCHED as setUser(data.user)
- Then, that setUser will be used in the `Register.jsx and Login.jsx` to set the user state
- And will export the useAuth with return {handleRegister, handleLogin} and also the loading and error states as well.

Google OAuth 2.O Setup stage (in Backend)- npm i passport passport-google-oauth20

adding client ID and client Secret environment variables by wiring up inside `Config.js`.

Importing in Backend `app.js`

Now creating `APIs (protected APIs using auth.middleware.js)`, `product.model.js` and creating model and schema to create products.

Need auth.middleware.js for handling those protected routes like for the seller login (not the buyer).
And to identify who is login, Token is needed for that from jwt and `configs.js`

Now APIs should have routes and controllers.
So creating the `product.route.js` to handle the products api using import express Router and auth.middleware.js in `product.route.js`

Now creating `product.controller.js`

But before that creating image storage service `storage.service.js` using the ImageKit service -> (in Backend) -> npm install @imagekit/nodejs

Now will setup ImageKit and create `Upload file function` inside services folder `storage.service.js`

Now will install and setUp multer (in Backend) -> npm i multer inside
`product.route.js`


