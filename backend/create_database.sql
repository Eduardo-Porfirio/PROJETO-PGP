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

set search_path to back;