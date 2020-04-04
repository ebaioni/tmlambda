
# tmlambda  
  
## Project Structure
The project comprises of multiple folders:

 - **coverage** (I would usually let the CI/CD pipeline generate this rather than from the project): it contains the code coverage report
 - **local-invoke**: it contains the payloads to run lambda functions locally via `sls invoke local` command
 - **mock-data**: it contains the mock data for unit tests
 - **scripts**: it contains useful scripts such a pre-push hook so that tests & lint are run on the local machine before being pushed remotely.
	 - *postinstall.sh* automatically replaces the githook/pre-push file after node modules are installed
 - **src**: it contains the source code
 - **lib** (not versioned): this is where babel will compile the files into

## How to run the project locally 
Run the following commands:

 - `git clone git@github.com:ebaioni/tmlambda.git`
 - `cd tmlambda`
 - `npm install`
 - `npm run build`

In order to run the  getEC2SecGroups function:

 - `sls invoke local -f getEC2SecGroups`

Authoriser:

 - `sls invoke local -f customAuthorizer -p local-invoke/authorizerSuccess.json`
 - `sls invoke local -f customAuthorizer -p local-invoke/authorizerFailure.json`

Remote Invoker

 - `curl "https://3zgq358hrg.execute-api.ap-southeast-2.amazonaws.com/staging/ec2/secgroups?allow=yes"`
 - `curl "https://3zgq358hrg.execute-api.ap-southeast-2.amazonaws.com/staging/ec2/secgroups?allow=no"`
