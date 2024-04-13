# Medication Pal

## 1. Project Description
Our team, BBY06, is developing an application called MedicationPal™ which assists people who forget to take their medication or supplements of any kind by reminding them and allowing them to keep track. 

## 2. Names of Contributors
* Hi, my name is Ben. Github is very interesting and i am excited to learn how to utilize it
* Hi my name is Samarjit Bhogal. I am excited to develop MedicationPal and learn new things along the way.
* Hi, my name is Xiaojuan Wang. I am excited to start workiing on this project.
* One thing to note is that the contributor "jeven-on-road" is a secondary account of Nikkki99
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
	* Firestore
 	* Cloud storage
  	* Firebase Hosting
  	* Authentication

## 4. Complete setup/installion/usage
Here are the steps ...
* Login or create an account.
* Create a medication entry of a medication that you want to keep track of.
* View the medication entry on the homepage.
* Click into the entry and click "TAKE" when it is time to take the medication.
* The user will be notified via an alert when it is time to take their medication.
* See the progress increase for the day and the history update on the progress page.
* Update your doctor's information on the Doctor Info page and see this change on the homepage.
* View the medication entry at any time in the view entry page and see the details that were entered upon initial creation.
* Delete an entry when medication done tracking the medication.

## 5. Known Bugs and Limitations
Here are some known bugs:
* The delete entry function on the view entry page may delete the wrong entry.
* The Schedule page may not properly render based if the user has any entries that are occuring daily.
* Clicking the "OK" button quickly on the modal that appears soon after clicking save when creaing a medication entry can stop the photo from uploading to Firebase cloud storage. 

## 6. Features for Future
What we'd like to build in the future:
* Finish implementing the caretaker feature that we initially started out with.
* Integrate Firebase Messaging with FCM so users can get notification even while not using the app.
* Redo the schedule page to that is looks more mobile friendly.
	
## 7. Contents of Folder
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── README.md		     # the readme file of this project
├── index.html               # the page where we first run our application
├── favicon-32x32.png        # the favicon of MedicationPal
├── package-lock.json	     # pack-lock.json configuration file
├── package.json             # project dependencies 

It has the following subfolders and files:
├── images                   # Folder for images
	/logo.png                   (Logo designed by Sam)     
	/palette1.png               (the colors we used to design our website)
	/image.webp                 (the landing page image)
	/view-list-svgrepo-com.svg  (view entries icon in hot-bar)
	/home-20-svgrepo-com.svg    (home icon in hot-bar)
	/heart-plus-svgrepo-com.svg (create entry icon in hotbar
├── scripts                  # Folder for scripts
	/authentication.js         #the script we used to know if a user is logged in
	/createEntryServeice.js    #script for creating entries 
	/firebaseAPI_BB06.js       # our firebase API
	/homepageEntries.js        # script to display everything on the homepage
	/logoutAuth.js             # script to logout
	/main.js                   # check if a user is logged in
	/medicationPalsService.js  # a script for the MedicationPal feature (not in final version)
	/navSkeleton.js            # For the navigation bar skeleton to be displayed on all pages where used
	/notifiactionManager.js    # For sending out notifications at a certain time
	/profile.js                # for getting doctors information
	/progressBar.js            # for displaying the progress bar
	/readEntryService.js       # to read entries
	/readProgress.js           # for reading the progress bars data
	/schedule.js               # to display our entries on the schedule page
	/timer.js                  # function to displaymodal on certain time
├── styles                   # Folder for styles of different pages
	/craeteEntryStyle.css
	/doctorStyle.css
	/faqStyle.css
	/homepageStyle.css
	/loginStyle.css
	/medicationPalsStyle.css
	/notificationStyle.css
	/progresStyle.css
	/style.css                 # main style file
	/tableStyle.css            # style for the table present in the schedule page

	these are the styles for the individual pages we have on our application
├── pages                    # Folder for pages
	/create-entry.html         # the page for creating a medication entry
	/doc-info.html             # the page for changing doctors information
	/faq.html                  # the page for viewing frequently asked questions
	/homepage.html             # our main page, where all of our main tasks happen. also can view all sorts of data here.
	/login.html                # the login page
	/medication-pals.html      # the page to send your information to another PAL (not in final app release)
	/notifications.html        # the page to change what type of notifications you can receive
	/progress.html             # the page to check your medication progress
	/schedule.html             #  the page to view schedules
	/template.html             # a template page for when we made new pages
	/viewentries.html          # a view entries page, for viewing all medications you had made

├── components               # Folder for components
	/footer.html               # a footer that has a small trademark, and year
	/hot-bar.html              # a hotbar at the bottom of our page for quick access
	/markerBtn.html            # a component for a marker button next to the medication entries
	/navbar_before_login.html  # a component for our navbar before logging in (it much more limited options)
	/navbar.html               # a component for our nav bar
	/undoBtn.html              # a component for changing a marker button to an undo button

Firebase hosting files: 
├── .firebase
	/hosting..cache
├── .firebaserc
├── 404.html
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── storage.rules

```


