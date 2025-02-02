DROP TABLE `user`;

CREATE TABLE `user` (
    `id` varchar(255) primary key,
    `username` varchar(255) NOT NULL UNIQUE,
    `email` varchar(255) NOT NULL UNIQUE,
    `passwordHash` varchar(255) NOT NULL
);
