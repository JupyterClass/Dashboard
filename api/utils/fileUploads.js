import formidable from "formidable";
import fs from "fs";

export function getFileUploadContents(
  req,
  options = {
    ext: ''
  }
) {
  const form = formidable({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        if (files.file.name.endsWith(options.ext)) {
          resolve({
            fileName: files.file.name,
            contents: fs.readFileSync(files.file.path).toString()
          });
        } else {
          reject(new Error(`Uploaded file '${files.file.name}' of an unrecognised file extension`))
        }
      }
    })
  })
}
