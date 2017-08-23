#!/usr/bin/ksh

#*********************************************************************** Function to purge log files older than 2 weeks for this application *******************************************************************#
purgeOldLogFile(){
	if [ ! -d ./backup ]; then
	  mkdir ./backup
	fi
	
	echo "Moving pewvious log file/s to backup directory..."
	
	find -maxdepth 1 -type f -name '*.log' -a -not -name $LOG_FILE -exec mv -t ./backup {} \;

	logFileFormat=`echo "${LOG_FILE%.*}"`
	logFileFormat=${logFileFormat}*.log
	#print and delete log file for this app older than a week
	noOfLogFiles=`find ./backup -type f -name "$logFileFormat" -mtime +14 | wc -l | sed -e 's/^ *//'`
	echo "No of log files to be deleted : $noOfLogFiles"
	if [[ "$noOfLogFiles" -ne "0" ]]; then
		echo "Following old log files will be deleted:"
		find ./backup -type f -name "$logFileFormat" -mtime +14 -exec echo {} \; -exec rm -rf {} \;
	fi
}
#***************************************************************************************************************************************************************************************************************#


stopAllContainers(){
	containerList=$(docker ps -a --filter "name=quest-*" --format "{{.ID}}")
	
	echo ""
	echo "List of Containters :"
	echo "$containerList"
	echo ""

	if [ -n "$containerList" ];
	then
		echo ""
		echo " **************************************************************************************************************************"
		echo " *                 		Following Containter/s & Image/s will be stopped and removed.				*"
		echo " **************************************************************************************************************************"
		echo ""
		for container in $containerList
		do
			image=$(docker ps -af "id=$container" --format="{{.Image}}")
			docker ps -af "id=$container" --format="table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Command}}\t{{.Ports}}"
			docker stop $container
			if [ $? != 0 ];
			then
				echo ""
				echo "Problem stopping containter :$containter"
				exit $?	
			fi
			
			echo ""
			docker rm -fv $container
			if [ $? != 0 ];
                        then
				echo ""
                                echo "Problem removing containter :$containter"
                                exit $?
                        fi

			echo ""

			if [ $image == $CLIENT_APP_TAG -o $image == $SERVER_APP_TAG ];
			then
                        	docker rmi -f $image
                        	if [ $? != 0 ];
	                        then
        	                        echo ""
                	                echo "Problem removing image :$image"
                        	        exit $?
                        	fi
			fi
			echo ""
		done
	fi
}

deployCode(){
	stopAllContainers
	buildClientImage
	deployClientApp
	buildServerImage
	deployServerApp
}

buildClientImage(){
	echo ""
        echo " **************************************************************************************************************************"
        echo " *                                Building new Image for Client application.			                        *"
        echo " **************************************************************************************************************************"
        echo ""

	cd $APP_CLIENT_DIR
	sudo docker build -t $CLIENT_APP_TAG --no-cache --label $APP_LABEL_NAME -f ./$CLIENT_APP_DOCLER_FILE .
	
	echo ""
	
	if [ $? != 0 ];
	then
		echo ""
		echo "Problem creating image for Client."
		exit $?
	fi
	echo ""
	echo "*********Successfully built Image for Client Application***************"
	echo ""
}

deployClientApp(){
        echo ""
        echo " **************************************************************************************************************************"
        echo " *                                Starting containter for client application.                                             *"
        echo " **************************************************************************************************************************"
        echo ""

	docker run -dit --name "$CLIENT_APP_NAME"_"$APP_VERSION" -p $CLIENT_HOST_PORT:$CLIENT_CONTAINER_PORT $CLIENT_APP_TAG 
	
	echo ""	
        
	if [ $? != 0 ];
        then
		echo ""
                echo "Problem starting container."
                exit $?
        fi
	
        echo ""
        echo "*********Client Application Containter started successfully.***************"
        echo ""
 
}


buildServerImage(){
        echo ""
        echo " **************************************************************************************************************************"
        echo " *                                Building new Image for Server application.                                              *"
        echo " **************************************************************************************************************************"
        echo ""

		cd $APP_SERVER_DIR
        sudo docker build -t $SERVER_APP_TAG --no-cache --label $APP_LABEL_NAME -f ./$SERVER_APP_DOCLER_FILE .

		echo ""

        if [ $? != 0 ];
        then
		echo ""
                echo "Problem creating image for Server."
                exit $?
        fi

        echo ""
        echo "*********Successfully build Image for Server Application***************"
        echo ""

}

deployServerApp(){
        echo ""
        echo " **************************************************************************************************************************"
        echo " *                                Starting containter for Server application.                                             *"
        echo " **************************************************************************************************************************"
        echo ""

        docker run -dit --name "$SERVER_APP_NAME"_"$APP_VERSION" -p $SERVER_HOST_PORT:$SERVER_CONTAINER_PORT $SERVER_APP_TAG

        echo ""

        if [ $? != 0 ];
        then
                echo ""
                echo "Problem starting container."
                exit $?
        fi

        echo ""
        echo "*********Server Application Containter started successfully.***************"
        echo ""

}


main(){
    ts=$(date +'%Y%m%d_%H%M%S')
	LOG_FILE="quest.$ts.log"

	>$LOG_FILE

	tail -f $LOG_FILE &

	tailpid=$!

	purgeOldLogFile 2>&1 >>$LOG_FILE
	
	if [[ "$#" == 1 ]];
	then
	        #deploy or update application
	        export APP_VERSION=$1
	else
		echo ""
		echo "Please pass version in the format max.minor.patch. E.g 1.0.0"
		exit 1
	fi

	##The value of this variable is a token which will be replaced by Gradle while building.
	export APP_DIR="@SERVER_STAGE_DIR@/@APP_NAME@/@CURRENT_DIR@"	
	export APP_LABEL_NAME="@GROUP_NAME@"

	ts=$(date +'%Y%m%d_%H%M%S')

	#Client App Information
	export APP_CLIENT_DIR="$APP_DIR/client"
	export CLIENT_HOST_PORT=80
	export CLIENT_CONTAINER_PORT=80
	export CLIENT_APP_NAME=quest-client
	export CLIENT_APP_DOCLER_FILE=quest.client.docker
	export CLIENT_APP_TAG="$CLIENT_APP_NAME":"$APP_VERSION"

	#Server App Information
	export APP_SERVER_DIR="$APP_DIR/server"
	export SERVER_HOST_PORT=8080
	export SERVER_CONTAINER_PORT=8080
	export SERVER_APP_NAME=quest-server
	export SERVER_APP_DOCLER_FILE=quest.server.docker
	export SERVER_APP_TAG="$SERVER_APP_NAME":"$APP_VERSION"

	deployCode 2>&1 >>$LOG_FILE
	
	kill $tailpid
}

#Script start running from here
main "$*"
