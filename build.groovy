
environments{
	dev{
		DB_SERVER='questv4.cdmjx8kshlpv.us-east-1.rds.amazonaws.com'
		DB_PORT='1433'
		DB_USER='quest'
		DB_PASSWORD='Quest$2017'
		DB_NAME='FMCSA'
		ALLOWED_ORIGIN='[ "http://127.0.0.1:80","http://localhost:80","http://ec2-54-175-126-35.compute-1.amazonaws.com:80","http://ec2-54-175-126-35.compute-1.amazonaws.com"]'
		CABADV_URL='https://ws.cabadvantage.com/CFWebService.cfc?method=getUWInfo&keycode=gKsshaw6VvmBFdNtsm4hBBEv&dot='
	}
	
	qa{	
	}
	
	uat{
	}
	
	prod{
	}
		
	local{
		DB_SERVER='DVW-SQL02'
		DB_PORT='1433'
		DB_USER='quest'
		DB_PASSWORD='De8Qu#st'
		DB_NAME='QUEST'
		ALLOWED_ORIGIN='[ "http://127.0.0.1:80","http://localhost:80"]'
		CABADV_URL='https://ws.cabadvantage.com/CFWebService.cfc?method=getUWInfo&keycode=gKsshaw6VvmBFdNtsm4hBBEv&dot='
	}
}