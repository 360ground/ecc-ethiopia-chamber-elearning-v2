

**Ethiopian chamber of commerce (ECC)**

**Project description**

This is a platform designed for the Ethiopian chamber of commerce to facilitate digital learning. The platform comprises three primary components: the front-end, back-end, and actual canvas LMS system. Its purpose is to simplify the learning process, payment procedures, and administrative tasks.

**Steps to set up the project**

To utilize Canvas LMS, it needs to be properly deployed and operated. In addition, the back-end must also be operated to support the system. Finally, the front-end needs to be executed and integrated with the back-end.


**Information on how to run the project locally,**

To run the back-end, use the following command:

`	`**nodemon --watch** 

Please note that you must be in the project directory to run these commands

**Information on how to connect to API, other apps, etc.**

The data flow operates in the following sequence:

1. The back-end establishes a connection with the Canvas LMS API.
1. The front-end establishes a connection with the back-end to receive the data.

**Information on how to deploy on production (or other environments)**

To build the Back-end in a production environment, follow these steps:

1. Commit and push the changes to the Git repository.
1. Login to the server
1. Stop  the express server by executing the command “pm2 stop 0”
1. pull the changes from the git repository
1. start the express server by executing the command “pm2 start index.js” inside the main directory


**API design documentation**

- The project's documentation can be found in the "docs" directory and can be accessed by running the following commands: ‘npx http-server ./docs’

**Information on architecture and design**

- It is located in the "document" directory of the project

**App/code structure**
**

**Information of assets outside of the source control repository i.e.**

- No available 

**other relevant information that would make it easy for a new developer to take over the project without your support**

1. [**https://canvas.instructure.com/doc/api/**]()
1. [**https://www.npmjs.com/package/node-canvas-api**]()


**AWS assets**
**
`	`It is located in the "document" directory of the project.

**Provide documentation**

In addition to the read-me file provide documentation for

**Application architecture design (final version)**

- [https://www.figma.com/file/DiWeQHKPhELYgV8aHQf2BW/ESS-LMS-UI?node-id=401-144&t=No34rIkHnRHCEOi9-0]()

**Business implementation logic**

The general business logic of the system can be summarized as follows: The courses can be accessed in two forms, one that requires payment and the other that is free. When a user chooses to enroll in a paid course, the system will verify the user's authentication and previous enrollment in the course, and then proceed to the payment gateway. If the user accepts the payment, the system will enroll the user. On the other hand, if the user selects a free course, the system will check the user's authentication and previous enrollment in the course, and then enroll the user.


**In-line code documentation**

- So you have added inline comments to the code to indicate areas where the logic may not be clear or well-defined. This can be helpful for other developers who may work on the code in the future, as they can refer to these comments to better understand the code and make improvements as needed.

**List of 3rd party services**

1. Medapay
1. Canvas LMS it self

**Access to 3rd party services**

To access the Canvas LMS API, you need to generate an API key and then follow these steps:

1. Generate an API key from the Canvas LMS website.
1. Put the API key inside the environment of the back-end. You can use the node-canvas-api module to do this, which will help prevent any CORS issues.
1. Make the request through the back-end to access the Canvas LMS API.

`	`By following these steps, you can successfully access the Canvas LMS API and 	integrate it into your project

To access the Medapay, you need to generate an API key and then follow the instruction given by the creators:

**Error Logs and steps taken to resolve**

While there are no error logs present, typically I resolve errors by engaging in the debugging process.
