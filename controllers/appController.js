const jimp = require('jimp');
const uuid = require('uuid');
const jsonPatch = require('jsonpatch');

exports.fileResize = async (req, res) => {
  try {
    const myImage = await jimp.read(req.body.image);
    const ext = await myImage.getExtension();
    await myImage.resize(150, 150);
    const image = `${uuid.v4()}.${ext}`;
    await myImage.write(`./public/uploads/${image}`);
    res.render('dashboard', { image });
  } catch (error) {
    res.redirect('back');
  }
};

exports.jsonPatch = (req, res) => {
  try {
    const json = JSON.parse(req.body.json);
    const patch = JSON.parse(req.body.patch);
    // Apply the patch
    const patchDoc = jsonPatch.apply_patch(json, patch);

    res.render('dashboard', { patchDoc });
  } catch (error) {
    res.redirect('/dashboard');
    console.log(error);
  }
};
