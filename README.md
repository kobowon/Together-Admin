# Together-Admin

This is capston project named Volunteer-Matching and this repository is associated with Admin and API.

Table is like this

CREATE TABLE user
(userID varchar(30) NOT NULL,helper_pwd varchar(30),helper_name varchar(30),user_phone varchar(30),userType varchar(20),userFeedbackScore int unsigned,profile_image blob,token varchar(50),helpee_latitude double,helpee_longitude double,PRIMARY KEY(userID));


CREATE TABLE volunteerItem
(volunteer_id int(10) unsigned NOT NULL auto_increment,  type varchar(30) NOT NULL,  helper_ID varchar(30) NOT NULL,  helpee_ID varchar(30) NOT NULL,  latitude double NOT NULL,  longitude double NOT NULL,  matchingStatus int NOT NULL,  startStatus int NOT NULL,  content varchar(100),  hour int NOT NULL,  minute int NOT NULL,  duration int NOT NULL,  year int NOT NULL,  month int NOT NULL,  day int NOT NULL,  helpee_Score int,  helper_Score int,  PRIMARY KEY (volunteer_id));
