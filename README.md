# Backend Task Documentation

## Running the App

Rename the `variables.env.sample` to `variables.env` to use environment variables. I have just added the SECRET word to be used on the JWT verification.

If you want to deploy the app in a server, then change the PORT number in `variables.env` from 3000 to 80.

Use `npm start` to start the server for production
Use `npm run dev` to start the development run

## Basic App Usage

Launch the app by going to _localhost:3000_

The front page shows a login screen. Enter any username or password. Now on the next page _/dashboard_ you will see two secions, _JSON Patch_ and _Generate Thumbnail_

### JSON Patch

You can patch a JSON file with this tool. Just enter a json object, and a patch info and click submit. You will receive the patch in the next page load.

### Generate Thumbnail

Enter a public image file in the text field and click Generate. You will get a 150x150 resized version of that image on the next page load.

# Under The Hood

## Express with Pug

I used express.js for the web framework with pug template engine. `server.js` is the main entry file.

## Express session

`express-session` module is used to capture the user session and pass the JWT token from page to page.

## JWT token

On the front page there is a login form, that sends an HTTP POST request with username and password in the body. I used `body-parser` to parse the data in json. Then once someone logs in, they are given a JWT token with no expiration.

The JWT token is then saved to the `req.session.token` object. This is the way I have attached the token with user sessions.

## Verify token middleware

In _routes/index.js_ there is a `verifyToken` middleware function. This middleware will first check if there is a `req.session.token` present. Then once it's present, it will run the JWT verify method to check if the token is valid.

Once the token is verified, access is given by calling the `next()` method. If the token is not valid, the user will get a 403 (forbidden) error. This is the way I protected the POST api routes.

## Generate Thumbnail

Then user is supposed to enter a public image url from the internet. The url will be referrenced as the _image_ in the next request. I did this by adding the `name` field in the form input. The url is then sent to a middleware function in _appController_

I used the `jimp` module to resize the image.

In the `fileResize` middleware function, I added a `try catch` block for this operation. I first saved the image into a local variable `myImage`. I called _jimp.read(req.body.image)_ to read the file.

Please see inline comments in the file _/controllers/appController.js_ for more details. But the basic rundown is, I call resize the image to 150x150 and then save it to the disc giving a unique identifier.

For the unique ID I have used the _uuid_ module.

Once I have the image, I will then render the `Dashboard` page, passing in the image data.

In case of error, I redirect back the user to the last page.

### Displaying the thumbnail image

In the _views/dashboard.pug_ file, I have added a conditional block `if image` it will be activated only when there is the image present. It will display the image file right after the user successfully generated the thumbnail image.

## JSON Patch

The user can enter a JSON value and a patch request and have it patched. I used two textarea, one named `json`, the other named `patch` for this operation. Once they submit, the info is then passed down to a middleware called `jsonPatch` in appController. Once again I used a try catch block.

I used _JSON.parse()_ to parse the valuse before saving them onto the local variables.

Read the function for more details on the steps. In summary I patched the file. I have used the _jsonpatch_ module and used the `apply_patch()` method to return the patch and saving to a variable called `patchDoc`.

Finally I render out the dashboard file by passing down the patchDoc.

In the dashboard.pug file, when there is a patchDoc variable present, it will usually render the patch. But before that can happen I had to stringify that code once again.
