
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
 
  


1:  landing page design                         DONE
2:  focus on input on page open                 DONE
3:  send request for socket connection          DONE    
4:  create socket and test from servr.socket open or not
    add some records in database
    create tables in database
    get self detail api with groups joined by him
    create group api
    add members in group api
    get all member details api       
5:  add username from localstorage/session/selfdetailapi if not added client
    send login with socket client to socket server
    save session in socket server
6:  send welcome message to user after login from server
7:  catch welcome message and append it to the frontend
8:  send message to every user about new user joining from server
9:  catchnew user joining message and append it to the server
10: handle keyboard event and send message to server when enter
11: take that message from server and brodcast to everyone
12: catch that brodcast message and then append it to the chat

    handle keyboard event and send message to particular client when enter
    save message to database
    take that message from server and brodcast to everyone
    get personal chat message from api 
    catch that brodcast message and then append it to the chat

    handle keyboard event and send message to particular group when enter
    save message to database
    take that message from server and brodcast to everyone in group
    get group chat message from api 
    catch that brodcast message and then append it to the chat

13: send user typing event
14: catch user typing event and brodcast
15: send user left out                     
16: catch left out and brodcast everyone 
17: user stop typing
18: send user stop typing and brodcast to every1
19: send personal messg to sm1
20: catch from server,and brodcast to that prticulr sm1
21:
 
 
 
user_id   ret_id    email_id    Nickname
 
user_id_from   user_id_to   msg
 
 
 
 
 


