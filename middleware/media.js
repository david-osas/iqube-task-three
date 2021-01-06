const path = require('path');

const formidable = require('formidable');
const form = formidable({
  multiples: true ,
  uploadDir: path.join(__dirname, '../uploads'),
  keepExtensions: true,
});
const fieldSet = new Set(['landlords','environment','amenities','location']);

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
  if(Object.keys(fields).length !== fieldSet.size){
    res.send('Invalid number of arguments passed');
    return;
  }
  for(let key in fields){
    if(!fieldSet.has(key)){
      res.send('Invalid argument key passed');
      return;
    }
  }

  req.mediaPaths = mediaPaths;
  req.formText = {...fields, helpful: 0};
  next();
}

exports.getMediaList = getMediaList;
