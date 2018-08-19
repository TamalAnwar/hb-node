const jimp = require('jimp');
const uuid = require('uuid');
const jsonPatch = require('jsonpatch');

exports.fileResize = async (req, res) => {
  // Sanitizing body and requiring it not to be empty
  req.sanitizeBody('image');
  req.checkBody('image').notEmpty();

  let errors = req.validationErrors();
  // If there are errors, then exit.
  if (errors) {
    console.log(errors);
    res.redirect('back');
    return;
  }

  try {
    // Save the file in a local variable
    const myImage = await jimp.read(req.body.image);
    // Get the file extension for later use
    const ext = await myImage.getExtension();
    // Resize the image
    await myImage.resize(150, 150);
    // Setting the name of the image file as a unique
    // value and saving it in a variable
    const image = `${uuid.v4()}.${ext}`;
    // Write the image to the disk
    await myImage.write(`./public/uploads/${image}`);
    // Render the page and pass down the image to display it on page
    res.render('thumbnail', { image });
  } catch (error) {
    // In the case of an error, redirect the user back.
    res.redirect('back');
  }
};

exports.jsonPatch = (req, res) => {
  req.sanitizeBody('json');
  req.sanitizeBody('patch');
  req.checkBody('json').notEmpty();
  req.checkBody('patch').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.redirect('back');
    return;
  }

  try {
    // Parse the values and save it to a variable
    const json = JSON.parse(req.body.json);
    const patch = JSON.parse(req.body.patch);
    // Apply the patch
    const patchDoc = jsonPatch.apply_patch(json, patch);
    // Render the page passing down the patch
    res.render('jsonpatch', { patchDoc });
  } catch (error) {
    // If there is an error, redirect back to the page
    res.redirect('back');
  }
};
