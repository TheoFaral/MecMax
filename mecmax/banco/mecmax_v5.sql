

CREATE DATABASE IF NOT EXISTS mecmax_web;
USE mecmax_web;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS emprestimos;
DROP TABLE IF EXISTS manutencoes;
DROP TABLE IF EXISTS ferramentas;
DROP TABLE IF EXISTS mecanicos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS status_ferramenta;
DROP TABLE IF EXISTS localizacoes;
SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE categorias (
  id_categoria INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome_categoria VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE status_ferramenta (
  id_status INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  descricao_status VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE localizacoes (
  id_localizacao INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome_local VARCHAR(100) NOT NULL,
  tipo_local VARCHAR(50),
  codigo_local VARCHAR(6) UNIQUE 
) ENGINE=InnoDB;

CREATE TABLE mecanicos (
  id_mecanico INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(100) NOT NULL,
  matricula VARCHAR(20) NOT NULL UNIQUE,
  status_usuario ENUM('ATIVO', 'INATIVO') DEFAULT 'ATIVO',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE ferramentas (
  id_ferramenta INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  codigo_ferramenta VARCHAR(20) NOT NULL UNIQUE,
  nome_ferramenta VARCHAR(100) NOT NULL,
  descricao TEXT,
  marca VARCHAR(50),
  id_categoria INT,
  id_status INT DEFAULT 1,
  data_aquisicao DATE,
  CONSTRAINT fk_ferramentas_cat FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria),
  CONSTRAINT fk_ferramentas_stat FOREIGN KEY (id_status) REFERENCES status_ferramenta (id_status)
) ENGINE=InnoDB;

CREATE TABLE emprestimos (
  id_emprestimo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_mecanico INT NOT NULL,
  id_ferramenta INT NOT NULL,
  data_retirada DATETIME DEFAULT CURRENT_TIMESTAMP,
  previsao_devolucao DATETIME,
  data_devolucao DATETIME,
  local_uso VARCHAR(100),
  status_emprestimo ENUM('ATIVO', 'FINALIZADO', 'ATRASADO', 'DEVOLVIDO') DEFAULT 'ATIVO',
  CONSTRAINT fk_emp_mec FOREIGN KEY (id_mecanico) REFERENCES mecanicos (id_mecanico),
  CONSTRAINT fk_emp_fer FOREIGN KEY (id_ferramenta) REFERENCES ferramentas (id_ferramenta)
) ENGINE=InnoDB;

CREATE TABLE reservas (
  id_reserva INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_mecanico INT NOT NULL,
  id_ferramenta INT NOT NULL,
  data_reserva_inicio DATETIME NOT NULL,
  data_reserva_fim DATETIME NOT NULL,
  status_reserva ENUM('ATIVA', 'CANCELADA', 'CONCLUIDA') DEFAULT 'ATIVA',
  codigo_reserva VARCHAR(8),
  CONSTRAINT fk_res_mec FOREIGN KEY (id_mecanico) REFERENCES mecanicos (id_mecanico),
  CONSTRAINT fk_res_fer FOREIGN KEY (id_ferramenta) REFERENCES ferramentas (id_ferramenta)
) ENGINE=InnoDB;

-- TRIGGERS
DELIMITER $$
CREATE TRIGGER atualiza_status_emprestimo AFTER INSERT ON emprestimos
FOR EACH ROW BEGIN
    UPDATE ferramentas SET id_status = 2 WHERE id_ferramenta = NEW.id_ferramenta;
END$$
CREATE TRIGGER atualiza_status_devolucao AFTER UPDATE ON emprestimos
FOR EACH ROW BEGIN
    IF NEW.status_emprestimo IN ('FINALIZADO', 'DEVOLVIDO') THEN
        UPDATE ferramentas SET id_status = 1 WHERE id_ferramenta = NEW.id_ferramenta;
    END IF;
END$$
DELIMITER ;

-- DADOS

-- Status e Categorias
INSERT INTO status_ferramenta (id_status, descricao_status) VALUES (1, 'DISPONIVEL'), (2, 'EMPRESTADA'), (3, 'EM_MANUTENCAO'), (4, 'RESERVADA'), (5, 'INATIVA');
INSERT INTO categorias (nome_categoria) VALUES ('Manuais'), ('Elétricas'), ('Diagnóstico'), ('Pneumáticas'), ('Elevação'), ('Especiais');

-- Locais (Com Códigos 3num+3let)
INSERT INTO localizacoes (nome_local, tipo_local, codigo_local) VALUES 
('Box 01 - Mecânica Leve', 'OFICINA', '001BOX'),
('Box 02 - Mecânica Pesada', 'OFICINA', '002BOX'),
('Box 03 - Elétrica', 'OFICINA', '003BOX'),
('Bancada de Testes A', 'OFICINA', '001BNC'),
('Cabine de Pintura', 'PINTURA', '001PNT'),
('Estoque Central', 'ALMOXARIFADO', '001EST'),
('Área de Lavagem', 'EXTERNO', '001LAV');

-- Mecânicos 
INSERT INTO mecanicos (nome_completo, matricula) VALUES 
('João da Silva', '100001'),
('Maria Oliveira', '100002'),
('Carlos Souza', '100003'),
('Ana Pereira', '100004'),
('Roberto Santos', '100005'),
('Fernanda Lima', '100006'),
('Theo Dornelles', '101010');

-- Ferramentas 
INSERT INTO ferramentas (codigo_ferramenta, nome_ferramenta, marca, id_categoria) VALUES 
('FUR001', 'Furadeira Impacto', 'Bosch', 2),
('PAR002', 'Parafusadeira', 'Makita', 2),
('SCA003', 'Scanner OBD2', 'Launch', 3),
('ALI004', 'Alinhador 3D', 'Sun', 3),
('MAC005', 'Macaco Jacaré 2T', 'Vonder', 5),
('TOR006', 'Torquímetro Estalo', 'Gedore', 1),
('CHV007', 'Jogo Chaves Boca', 'Tramontina', 1),
('COM008', 'Compressor de Ar', 'Schulz', 4),
('PIS009', 'Pistola de Pintura', 'Arprex', 4),
('ELE010', 'Elevador 4 Ton', 'Engecass', 5);

-- CENÁRIOS

-- Empréstimos FINALIZADOS
INSERT INTO emprestimos (id_mecanico, id_ferramenta, data_retirada, data_devolucao, local_uso, status_emprestimo) VALUES 
(1, 1, '2023-10-01 08:00:00', '2023-10-01 12:00:00', '001BOX', 'FINALIZADO'),
(2, 3, '2023-10-02 09:00:00', '2023-10-02 18:00:00', '003BOX', 'FINALIZADO'),
(3, 5, '2023-10-03 14:00:00', '2023-10-03 16:00:00', '002BOX', 'FINALIZADO');

-- Empréstimos ATIVOS
INSERT INTO emprestimos (id_mecanico, id_ferramenta, data_retirada, previsao_devolucao, local_uso, status_emprestimo) 
VALUES (2, 3, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), '003BOX', 'ATIVO');

INSERT INTO emprestimos (id_mecanico, id_ferramenta, data_retirada, previsao_devolucao, local_uso, status_emprestimo) 
VALUES (5, 2, NOW(), DATE_ADD(NOW(), INTERVAL 4 HOUR), '001BNC', 'ATIVO');

-- Empréstimo ATRASADO
INSERT INTO emprestimos (id_mecanico, id_ferramenta, data_retirada, previsao_devolucao, local_uso, status_emprestimo) 
VALUES (3, 4, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), '002BOX', 'ATRASADO');

-- Atualiza status das ferramentas ocupadas
UPDATE ferramentas SET id_status = 2 WHERE id_ferramenta IN (3, 2, 4);