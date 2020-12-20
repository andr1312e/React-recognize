import Dropzone from 'react-dropzone-uploader'
import React from 'react'

export const MyUploader = (ctx) => {
  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => {

  }

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    let img = new Image();
    let fr = new FileReader();
    img.setAttribute('crossOrigin', '');
    let file_one = allFiles[0];
    console.log("type", file_one.file);
    if (file_one && file_one.file.type.match('image.*')) {
      fr.readAsDataURL(file_one.file);
    }
    let widthcoef = 1;
    let heightcoef = 1;
    fr.onload = () => {
      img.onload = () => {
        widthcoef = 800 / img.width;
        heightcoef = 450 / img.height;
        if (widthcoef > heightcoef) {
          widthcoef = heightcoef
        }
        else {
          heightcoef = widthcoef;
        }
        console.log("img.width", img.width);
        console.log("img.height", img.height);
        console.log("widthcoef", widthcoef);
        console.log("heightcoef", heightcoef);
        ctx.valueChange.drawImage(img, 0, 0, img.width * widthcoef, img.height * heightcoef);
      };
      img.src = fr.result;
    }
    //fr.readAsDataURL(file_one.file);
    //allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      classNames="dropzone"
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*"
    />
  )
}