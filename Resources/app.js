
var win = Titanium.UI.createWindow({
    title:'MissingOrWanted',
    backgroundColor:'#fff'
});

var showCameraButton = Titanium.UI.createButton({
    title:'Show Camera',
    width:200,
    height:40,
    top:10
});

var showCameraButtonImageView = Ti.UI.createImageView({
    url:'./images/camera.png',
    left:10,
    height:33,
    width:33
});
showCameraButton.add(showCameraButtonImageView);
win.add(showCameraButton);

var ind=Titanium.UI.createProgressBar({
    width:200,
    height:50,
    min:0,
    max:1,
    value:0,
    style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
    top:100,
    message:'Uploading Image',
    font:{fontSize:12, fontWeight:'bold'},
    color:'#888'
});

win.add(ind);

win.open();
win.show();
ind.show();

var showCamera = function() {
    
    Titanium.Media.showCamera({
    
        success:function(event)
        {
            var cropRect = event.cropRect;
            var image = event.media;
    
            Ti.API.debug('Our type was: '+event.mediaType);
            if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
            {
                var xhr = Titanium.Network.createHTTPClient();
    
                xhr.onerror = function(e)
                {
                    Ti.UI.createAlertDialog({title:'Error', message:e.error}).show();
                    Ti.API.info('IN ERROR ' + e.error);
                };
                xhr.setTimeout(20000);
                xhr.onload = function(e)
                {
                    Ti.UI.createAlertDialog({title:'Success', message:'status code ' + this.status + '; responseText: ' + this.responseText}).show(); // TODO parse response JSON or XML and display results in a better way
                    Ti.API.info('IN ONLOAD ' + this.status + ' readyState ' + this.readyState);
                    
                    // reset progress bar
                    ind.value = 0;
                };
                xhr.onsendstream = function(e)
                {
                    // TODO disable showCameraButton
                    ind.value = e.progress ;
                    Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress);
                };
                // open the client
                xhr.open('POST', 'http://api.face.com/faces/recognize.json');
        
                // send the data
                xhr.send({upload:image, api_key:'16136c678312a506329d894afba237c4', api_secret:'cbc9bce49bee5eb40f9c3141de9ee4e9', uids:'1', namespace:'MissingOrWanted', detector:'Aggressive', attributes:'all'}); // TODO hide api secret!
            }
            else
            {
                alert("got the wrong type back ="+event.mediaType);
            }
        },
        cancel:function()
        {
        },
        error:function(error)
        {
            // create alert
            var a = Titanium.UI.createAlertDialog({title:'Camera'});
    
            // set message
            if (error.code == Titanium.Media.NO_CAMERA)
            {
                a.setMessage('Please run this test on device');
            }
            else
            {
                a.setMessage('Unexpected error: ' + error.code);
            }
    
            // show alert
            a.show();
        },
        saveToPhotoGallery:true,
        allowEditing:true,
        mediaTypes:Ti.Media.MEDIA_TYPE_PHOTO
    });
};

showCameraButton.addEventListener('click', showCamera);
showCamera();
