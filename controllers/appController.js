const jimp = require('jimp');
const uuid = require('uuid');

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
