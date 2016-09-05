
# Socket.IO Chat

A simple chat demo for socket.io

## How to use

```
$ cd socket.io
$ npm install
$ cd examples/chat
$ npm install
$ node .
```

And point your browser to `http://localhost:3000`. Optionally, specify
a port by supplying the `PORT` env variable.

## Features

- Multiple users can join a chat room by each entering a unique username
on website load.
- Users can type chat messages to the chat room.
- A notification is sent to all users when a user joins or leaves
the chatroom.



create database myfantasy;

use myfantasy;

create table UserBasicInfo(
user_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
username varchar(50) NOT NULL UNIQUE,
password varchar(50) NOT NULL,
email_id varchar(100),
mobile_no int(15),
profile_pic varchar(100),
status boolean NOT NULL,
created_at timestamp,
updated_at timestamp
);

create table PersonalChatRecord(
chat_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
from_user varchar(50) NOT NULL,
to_user  varchar(50) NOT NULL,
message varchar(1000),
created_at timestamp,
updated_at timestamp,
created_by int,
updated_by int
);

create table GroupBasicDetails(
grp_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
grp_name varchar(50) NOT NULL,
grp_creator  varchar(50) NOT NULL,
grp_type  varchar(50) NOT NULL,
grp_admin  int,
created_at timestamp,
updated_at timestamp,
created_by int,
updated_by int
);

create table GroupUserDetails(
grp_id int,
user_id int,
created_at timestamp,
updated_at timestamp,
created_by int,
updated_by int
);

create table GroupMessageDetails(
grp_id int,
user_id int,
message varchar(1000),
created_at timestamp,
updated_at timestamp,
created_by int,
updated_by int
);





chat_id  from_user  to_user   message  created_at  updated_at   created_by   updated_by
grp_id   grp_name   grp_creator  grp_type  grp_admin  created_at  updated_at  created_by   updated_by
grp_id   user_id  created_at  updated_at  created_by   updated_by
grp_id   user_id   msg   created_at   updated_at   created_by   updated_by

select * from table 




love the way you lie
diamonds rihana


 
 
 
 
// stories
 
  

 
user_id   ret_id    email_id    Nickname
 
user_id_from   user_id_to   msg
 
 
 
 
 




ws://10.2.5.160/app/09754a58-cee3-4b84-a579-493eb0eae4d6?reloadUri=http://10.2.5.160/dev-hub/engine-api-explorer


var application_id = "09754a58-cee3-4b84-a579-493eb0eae4d6";
var qlikSocketUrl = "ws://10.2.5.160/ps/app/"+application_id+"?reloadUri=http://10.2.5.160/ps/dev-hub/engine-api-explorer";




{"method": "OpenDoc","handle": -1,"params": ["4a3e4a4d-69cf-488c-904e-d05df41d440c"],"id":1}

{"method":"GetObject","handle":1,"params":["dCZSBr"],"id":4,"jsonrpc":"2.0"} 
