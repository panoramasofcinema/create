// v04.1 (3.23)
var albumBucketName = "panoramas-of-cinema";
var bucketRegion = "eu-central-1";
var IdentityPoolId = "eu-central-1:4984eaf8-c6bb-4da6-879f-3503f64c9150";
var inputFolder = "input"

AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
    })
});

var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: { Bucket: albumBucketName }
});

function makeName(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

function formatName(name){
  let formatted = name.trim();
  formatted = formatted.replaceAll(' ', '_');
  formatted = formatted.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z._])/g, '');
  return formatted
}

function upImgs(event, albumName) {
  var files = event.target.files;
  var fileCount = 0;
  for (let file of files){
    var fileName = formatName(file.name);
    var photoKey = encodeURIComponent(inputFolder)+'/'+encodeURIComponent(albumName)+'/'+encodeURIComponent(fileName);
    
    // Use S3 ManagedUpload class as it supports multipart uploads
    var upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file,
        ACL:'public-read'
      }
    });

    var promise = upload.promise();
    promise.then(
      function(data) {
        fileCount=fileCount+1;
        if (fileCount==files.length){
          alert(files.length+" images uploaded");
          reqPanorama(albumName);
        }
      },
      function(err) {
        alert("there was an error uploading your image ", fileName, err.message);
      }
    );
  }
}

function uploadImgs(event) {
    // MAKE A FOLDER NAME
    var albumName = makeName();
    albumName = albumName.trim();
    if (!albumName) {
      return alert("Album names must contain at least one non-space character.");
    }
    if (albumName.indexOf("/") !== -1) {
      return alert("Album names cannot contain slashes.");
    }
    
    // MAKE A FOLDER ON S3
    var albumKey = encodeURIComponent(inputFolder)+'/'+encodeURIComponent(albumName)+'/';
    s3.headObject({ Key: albumKey }, function(err, data) {
      if (!err) {
        return alert("Album already exists.");
      }
      if (err.code !== "NotFound") {
        return alert("There was an error1 creating your album: " + err.message);
      }
      s3.putObject({ Key: albumKey }, function(err, data) {
        if (err) {
          return alert("There was an error2 creating your album: " + err.message);
        }
      });
    });

    // UPLOAD IMAGES
    upImgs(event, albumName);
}
