const path = require('path');

const formidable = require('formidable');
const form = formidable({
  multiples: true ,
  uploadDir: path.join(__dirname, '../uploads'),
  keepExtensions: true,
});

async function getMediaList(req, res, next){
  let mediaPaths = [];
  let [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if(err){
        reject(err);
        return;
      }
      resolve([fields, files]);
    });
  });

  for(let key in files){
    mediaPaths.push(files[key].path);
  }
  req.mediaPaths = mediaPaths;
  req.formText = fields;
  next();
}

exports.getMediaList = getMediaList;
