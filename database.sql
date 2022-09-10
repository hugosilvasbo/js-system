create table cadastro (
	id serial primary key,
	razao_social varchar(80),
	telefone varchar(10),
	celular varchar(11)
),

-- itens testes:
insert into cadastro (razao_social, telefone, celular)
values
('Hugo Silva', '1934556797', '19989765488'),
('Maria José', '1934775502', '19989254532'),
('Francisco', '1934542211', '')