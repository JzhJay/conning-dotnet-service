import {defineMessages} from 'react-intl';

export const i18nMessages = defineMessages({
	name: {
		defaultMessage: 'Name',
		description: `[user file] User file upload form's name input field label text`
	},
	selectOneFileCount: {
		defaultMessage: 'Selected {count} File',
		description: `[user file] Show select one file in user file upload form`
	},
	selectFilesCount: {
		defaultMessage: 'Selected {count} Files',
		description: `[user file] Show selected files' count in user file upload form`
	},
	userFileBrowser: {
		defaultMessage: 'User File Browser',
		description: '[user file] User File Browser'
	},
	initialization: {
		defaultMessage: 'Initialization...',
		description: '[user file] Initialization'
	},
	addToQueue: {
		defaultMessage: 'Add To Queue',
		description: '[user file] Add file to upload queue'
	},
	upload: {
		defaultMessage: 'Upload',
		description: '[user file] upload'
	},
	cancel: {
		defaultMessage: 'Cancel',
		description: '[user file] Cancel upload'
	},
	closeWindow: {
		defaultMessage: 'Close Window',
		description: '[user file] Close Upload Window'
	},
	continue: {
		defaultMessage: 'Continue',
		description: '[user file] continue to create a simulation'
	},
	file: {
		defaultMessage: 'File',
		description: '[user file] File'
	},
	folder: {
		defaultMessage: 'Folder',
		description: '[user file] Folder'
	},
	fileUploadWithBrackets: {
		defaultMessage: '(File Upload)',
		description: '[user file] (File Upload)'
	},
	folderUploadWithBrackets: {
		defaultMessage: '(Folder Upload)',
		description: '[user file] (Folder Upload)'
	},
	uploadFile: {
		defaultMessage: 'Upload File or Folder',
		description: '[user file] Upload file or folder'
	},
	resume: {
		defaultMessage: 'Resume File Upload',
		description: '[user file] Resume file upload progress'
	},
	uploadInProgress: {
		defaultMessage: 'An upload is in progress ...',
		description: '[user file] An upload is in progress ...'
	},
	createSimulation: {
		defaultMessage: 'Create Simulation Without Upload',
		description: '[user file] Create Simulation Without Upload'
	},
	pendingUploadCount: {
		defaultMessage: 'Pending Upload: {count}',
		description: '[user file] Pending Upload Count'
	},	
	dropFileUpload: {
		defaultMessage: 'Drop file to upload',
		description: '[user file] Drop file to upload'
	},
	dropToUpload: {
		defaultMessage: 'Drop to upload',
		description: '[user file] Drop to upload'
	},	
	createNewSimulation: {
		defaultMessage: 'Creating New Simulation...',
		description: '[user file] Creating New Simulation'
	},
	noProgressUpdateWarning: {
		defaultMessage: 'There has been no progress update for {minutes} minutes. Network activity may be preventing successful upload. Please retry',
		description: '[user file] No Progress Warning'
	},
	errorAttemptRetry: {
		defaultMessage: '{message}. Attempting retry: {retryCount}',
		description: '[user file] Show error message and attempting retry count'
	},
	noFilesDetected: {
		defaultMessage: 'No file(s) detected',
		description: '[user file] No file(s) detected'
	},
	cancelUploadConfirm: {
		defaultMessage: 'Are you sure you want to cancel the upload process?',
		description: '[user file] Cancel Upload Confirm Message'
	},
	waitingForUpload: {
		defaultMessage: 'Waiting for Upload.',
		description: '[user file] Waiting for Upload.'
	},
	initializing: {
		defaultMessage: 'Initializing...',
		description: '[user file] One file upload process is initializing.'	
	},
	initialized: {
		defaultMessage: 'Initialized.',
		description: '[user file] One file upload process is initialized.'	
	},
	totalSize: {
		defaultMessage: 'Total Size: {size}',
		description: '[user file] Total Upload Files Size.'	
	},
	uploadComplete: {
		defaultMessage: '&nbsp;&nbsp;Upload Completed.',
		description: '[user file] Upload Completed.'	
	},
	uploadIsAlmostFinished: {
		defaultMessage: 'Upload is almost finished ...',
		description: '[user file] Upload is almost finished.'	
	},
	estimatingUploadTime: {
		defaultMessage: 'Estimating upload time...',
		description: '[user file] Estimating upload time.'	
	},
    secondOne: {
		defaultMessage: '{second} second ',
		description: '[user file] One Second'
	},
	secondOther: {
		defaultMessage: '{second} seconds ',
		description: '[user file] More than One Second'	
	},
    minuteOne: {
		defaultMessage: '{minute} min ',
		description: '[user file] One Minute'
	},
	minuteOther: {
		defaultMessage: '{minute} mins ',
		description: '[user file] More than One Minute'	
	},
    hourOne: {
		defaultMessage: '{hour} hr ',
		description: '[user file] One hour'
	},
	hourOther: {
		defaultMessage: '{hour} hrs ',
		description: '[user file] More than One hour'	
	},
	leftUploadTime: {
		defaultMessage: '{hour}{minute}{second}left...',
		description: '[user file] Estimate upload time'	
	},
	oneFileUploading: {
		defaultMessage: 'Uploading File... ({uploadedFilesCount}/{totalFilesCount})',
		description: '[user file] One file is uploading'
	},
	otherFileUploading: {
		defaultMessage: 'Uploading Files... ({totalFilesCount}/{totalFilesCount})',
		description: '[user file] More than one file are uploading'	
	},
	oneFileUploaded: {
		defaultMessage: '1 File Uploaded. ({totalFilesCount}/{totalFilesCount})',
		description: '[user file] One file is uploaded'	
	},
	otherFileUploaded: {
		defaultMessage: 'All Files Uploaded. ({totalFilesCount}/{totalFilesCount})',
		description: '[user file] All Files are uploaded'	
	},
	uploadInterrupted: {
		defaultMessage: 'Your upload was interrupted or stopped accidentally',
		description: '[user file] File upload was interrupted'
	},
	ignore: {
		defaultMessage: 'Ignore',
		description: '[user file] Ignore one interrupted file'
	},
	ignoreAll: {
		defaultMessage: 'Ignore All',
		description: '[user file] Ignore all interrupted files'
	}
});