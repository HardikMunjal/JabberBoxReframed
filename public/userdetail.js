<html>
	<head>
		<title>Home</title>
	</head>
	<body ng-app="fileUpload">
		<h1>Angular Node File Upload</h1>
        <form  ng-controller="MyCtrl as up" name="up.upload_form">
                Single Image with validations
            <input 
                type="file" 
                ngf-select 
                ng-model="up.file" 
                name="file" 
                ngf-pattern="'image/*'"
                accept="image/*" 
                ngf-max-size="20MB" 
                />
            Image thumbnail: <img style="width:100px;" ng-show="!!up.file" ngf-thumbnail="up.file || '/thumb.jpg'"/>
            <i ng-show="up.upload_form.file.$error.required">*required</i><br>
            <i ng-show="up.upload_form.file.$error.maxSize">File too large 
            {{up.file.size / 1000000|number:1}}MB: max 20M</i>
           <!--  Multiple files
            <div class="button" ngf-select ng-model="up.files" ngf-multiple="true">Select</div>
            Drop files: <div ngf-drop ng-model="up.files" class="drop-box">Drop</div> -->
            <button type="submit" ng-click="up.submit()">submit</button>
            <p>{{up.progress}}</p>
        </form>
	</body>
	<script type="text/javascript" src="angular/angular.min.js"></script>
	<script type="text/javascript" src="/node_modules/ng-file-upload/dist/ng-file-upload.min.js"></script>
	<script type="text/javascript" src="/node_modules/ng-file-upload/dist/ng-file-upload-shim.min.js"></script>
	<script type="text/javascript" src="main2.js"></script>
</html>