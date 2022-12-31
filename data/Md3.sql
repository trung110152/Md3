create database blog;
use blog;
CREATE TABLE member(
                     idMember INT AUTO_INCREMENT PRIMARY KEY,
                     accountName VARCHAR(40) not null,
                     password VARCHAR(255) not null ,
                     role VARCHAR(255) not null
);

CREATE TABLE post(
                     idPost INT AUTO_INCREMENT PRIMARY KEY,
                     postName VARCHAR(255)not null,
                     idMember int not null
);



alter table post add foreign key (idMember) references member(idMember) ;