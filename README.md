Adobe Analytics Dr Jones
==========================

Introduction
------------

A rich client side application for interacting with the Adobe Analytics REST API, version 1.4.

### Where you can see it (usually)

+ http://drjones.eyelock.net/ - minified version
+ http://drjones-staging.eyelock.net/ - unminified version


### Implemented current using:

+ Node (Package Management) - https://nodejs.org/
+ Bower (Package Management) - http://bower.io/
+ jHipster  (Skeleton of the app copied from jHipster, not the server side) - https://jhipster.github.io/

Which uses:

+ Bootstrap - http://getbootstrap.com/
+ Angular - https://angularjs.org/
+ Angular Bootstrap - https://angular-ui.github.io/bootstrap/

See the "About" page of the application for the other techs used


Configuring the project
--------------

2. Install Git Client
3. Install Node & Bower as per jHipster documentation for quickness http://jhipster.github.io/installation.html
4. (Optional) Install Yeoman, then Angular Generators
5. Clone this repository
6. In the project directory, run `npm update`
7. In the project directory, run `bower update`  (NB If you are asked about dependancies, choose the latest version of the library, this generally works :) )
8. Execute `cp config/aws_s3.sample config/aws_s3.json`, add your S3 details if needed (not needed if running locally)
9. Execute `cp config/slack.sample config/slack.json`, add your Slack details if needed (not needed if running locally)
10. Import into your favourite IDE  (I like Brackets: http://brackets.io/)

## Grunt Plugins

1. Follow instructions at http://gruntjs.com/creating-plugins if you are creating one.
2. If you want to install the existing grunt plugins, use `npm install ./grunt/grunt-taskregistry` to make it available.


Running the project
-------------------

1. Run `grunt serve` in the project directory.
2. This will give you live reload in your browser (via a proxy server) that allows quicker client side development.
3. Choose 'Operations > Login' and enter some credentials to log into the app.


Building the project
------------------

1. Run `grunt build`
2. A minified version of the application will be created in the `dist/` folder.

### Grunt Plugins

Some grunt plugins have been made to simplify some tasks within the project.  Generally these need done _before_ building the project.

#### TaskRegistry

Simple Grunt plugin to create the task-registry.json file from the predefined Tasks in the `app/data/tasks` folder.
This means that the task-registry.json does not need to be manually managed.
It is not called on build, as there are times where you might not want to re-generate the `task-registry.json` file during development.


Deploying the project
------------------
This project deploys to Amazon S3 buckets.   2 buckets are required, one for staging, and one for production:
- Staging - gets unminified version of code for debug
- Production - gets minified version of application

Setting up requires creating a aws_s3.json file in the config/ directory.   See aws_s3.sample for how it should be structured.

You can then deploy your local code via the following:

### grunt deployStaging

1) downloads existing code to backup/staging;
2) cleans the bucket (apart from bower_components);
3) uploads the code in differential format

### grunt deployProduction

1) builds the project using `grunt build`
2) downloads existing code to backup/production;
3) cleans the bucket of all files
4) uploads the code as new

### grunt deploy

1) Runs `grunt deployStaging`
2) Runs `grunt deployProduction`


Amazon S3 Static Website Hostingasdfasdfasd
-----------------
See http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html

Sample Public Bucket Policy for read on everything:

`
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadGetObject",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::dmysuperduperbucketname/*"
		}
	]
}
`

