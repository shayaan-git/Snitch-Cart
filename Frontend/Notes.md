## Backend Side

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

