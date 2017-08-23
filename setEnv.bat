REM Set your eclipse workspace, env to run etc here.
SET JAVA_OPTS="-DVERSION_TYPE=Manual" "-DBUILD_ENV=local" "-DVERSION=1.0.1"  "-DSERVER_TASK="


REM **********************************************************************JAVA_HOME********************************************************************************************
set JAVA_HOME=C:\Program Files\Java\jdk1.7.0_79
REM ****************************************************************END OF JAVA_HOME*******************************************************************************************



REM ****************************************************FLAGS USED BY BUILD FOR BUILD,STAGE,DOWNLOAD,UPLOAD and SERVER TASK****************************************************
REM Do we need to run build and create ear/jar/war files?
set IS_BUILD_APP=true

REM Do we need to stage application files to the server?.Note this is not for deploying applications.This will just copy all the files to server under a staging dir
set IS_STAGE_APP=true

REM Do we need to run any server tasks like deploying/uninstalling/restarting applications/module etc
set IS_SERVER_TASK=true

REM Do we need to download files from Nexus? Set this to true only if the build option is Stage only or Stage and Server Task. i.e IS_BUILD_APP=false and IS_STAGE_APP=true
REM When the build options is Stage or Stage and Server Task,the build script will not run the entire build instead it will just download the files from Nexus and copy to the server
set IS_DOWNLOAD_FILES=false

REM Do we need to upload the generated files to Nexus after the build?This is valid only if IS_BUILD_APP=true and you do not need to set to true if you running build locally
REM Set this to true only if you want to test uploading files to Nexus.
set UPLOAD_FILES_TO_NEXUS=false
REM ***********************************************END OF FLAGS USED BY BUILD FOR BUILD,STAGE,DOWNLOAD,UPLOAD and SERVER TASK***************************************************


REM *****************************************************************************Server*******************************************************************************************
REM Used only if IS_STAGE_APP or IS_SERVER_TASK is true
set SERVER_NAME=ec2-54-175-126-35.compute-1.amazonaws.com
set SERVER_USERNAME=ubuntu
set SERVER_PASSWORD=
set SERVER_KEY_FILE=ErisKeyPair.pem

REM SUDO user to UNIX server
set UNIX_SUDO_USER=jbossdev

REM Staging directory where the application files will be copied to UNIX server or AS400 server
REM set SERVER_STAGE_DIR=/home/ubuntu/stage
set SERVER_STAGE_DIR=/usr/app
SET UNIX_SERVER_STAGE_CUR_DIR=current
SET UNIX_SERVER_STAGE_BKP_DIR=backup
REM *************************************************************************End of Server****************************************************************************************



REM ************************************************************************Nexus Repo******************************************************************************************
REM URL for Nexus repository
set COMMON_REPO=http://pvw-javabuild01.cfins.com:8081/nexus/content/groups/com.cfins.repository.dev
set CFINS_REPO_URL=http://pvw-javabuild01.cfins.com:8081/nexus/content/repositories/CFINS_Releases_DEV
set NEXUS_DOWNLOAD_URL=http://pvw-javabuild01.cfins.com:8081/nexus/service/local/repositories/CFINS_Releases_DEV/content
set THIRD_PARTY_URL=http://pvw-javabuild01:8081/nexus/content/repositories/thirdparty

REM Username and password for Nexus repository
set REPO_USER_NAME=jenkins_test
set REPO_PASSWORD=welcome123
REM *********************************************************************End of Nexus Repo***************************************************************************************




REM **************************************************************************Git Parameters**************************************************************************************
REM These parameters will be added to META-INF entry of jar/war/ear.Not significant for local build
set GIT_URL=http://pvw-stash01:7990/scm/ca/servicescommon.git
set GIT_COMMIT=123345567
set GIT_VALUE=Test
set GIT_VERSION=develop
REM **********************************************************************End of Git Parameters***********************************************************************************