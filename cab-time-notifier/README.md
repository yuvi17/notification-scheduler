# CAB BOOKING TIME NOTIFIER

# This is an example project using the `scheduled-notifications` service. 


# WORKING
  - Hitting `/` opens up a page where user can get notified about when to leave to book a cab in order to reach his destination in time.

  - It asks the user for source coordinates, destination coordinates, his email (where he wants to be notified, NOT BEING STORED ANYWHERE) and the time by which he wishes to arrive at the destination.

  - It then calls the Google Maps API and a simulated Uber API, which return the time needed to reach the destination at the provided time and the time it takes to book an UberGo respectively. All this takes places on the server side.

  - Then the AWS StepFunction is triggered, with details to wait till the required time and then trigger an email to the address provided.

  - Hitting `/logs` will give you a log of all the API calls made to Google Maps and Uber API.

  - Currently the frontend and backend have error checks and the response will always be 200.


## Below are deployment scripts

## Working on the React App

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

It will be deployed along with the node app on running `node server.js`. See below.

## Working on Server Side

In the project directory, run

## npm install

to install the dependencies.

## node server.js 

or `nodemon` or `pm2` or whatever is your preference.

Then open `localhost:8080`. The app will be served from here.

# ENV Variables:

Please add the following ENV variables in `.env.development.local` for local development
GOOGLE_MAPS_KEY=yourapikeyforgoogle
STATE_MACHINE_ARN=yourstatemachine:deployment:arn
AWS_ACCESS_KEY_ID=YOURAWSKEYS
AWS_ACCESS_SECRET_KEY=YOURAWSKEYS





