INSERT INTO account (username, password, email, role) VALUES ('admin', 'admin', 'mail@admin.com', 'ROLE_ADMIN');
INSERT INTO account (username, password, email, role) VALUES ('name1', 'pass1', 'mail1', 'ROLE_USER');
INSERT INTO account (username, password, email, role) VALUES ('name2', 'pass2', 'mail2', 'ROLE_USER');

INSERT INTO request (account_id, amount) VALUES (1, 10);
INSERT INTO request (account_id, amount) VALUES (2, 20);