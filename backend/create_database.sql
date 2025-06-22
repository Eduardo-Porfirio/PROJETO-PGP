create schema if not exists back;

\c mydb

create table if not exists back.gender (
    id serial not null,
    type varchar(100),
    constraint pk_gender primary key (id)
);

INSERT INTO back.gender(id, type) VALUES (1, 'Masculino'), (2, 'Feminino'), (3, 'Outro');

create table if not exists back.user (
    id_user bigserial not null,
    name_user varchar(250),
    cellphone varchar(20),
    email varchar(250),
    password text,
    gender int,
    cpf_user varchar(11),
    date_born date,
    constraint pk_user primary key (id_user),
    constraint fk_user_gender foreign key (gender) references back.gender (id)  
);


create table if not exists back.room (
    id_room bigserial not null,
    name_room varchar(150),
    description text,
    created_at timestamp default current_timestamp,
    admin_id bigint not null,
    constraint pk_room primary key (id_room)
);

create table if not exists back.user_room (
    id_user bigint not null,
    id_room bigint not null,
    joined_at timestamp default current_timestamp,
    constraint pk_user_room primary key (id_user, id_room)
);

create table if not exists back.chat_message (
    id_message bigserial not null,
    id_room bigint not null,
    sender_id bigint not null,
    message_text text,
    sent_at timestamp default current_timestamp,
    constraint pk_id_message primary key (id_message)
);


set search_path to back;