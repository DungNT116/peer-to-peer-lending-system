INSERT INTO account (username, password, email, role) VALUES ('admin', 'admin', 'mail@admin.com', 'ROLE_ADMIN');
INSERT INTO account (username, password, email, role) VALUES ('user1', 'pass1', 'mail1', 'ROLE_USER');
INSERT INTO account (username, password, email, role) VALUES ('user2', 'pass2', 'mail2', 'ROLE_EMP');

INSERT INTO request (from_account_id, to_account_id, amount) VALUES (1, 2, 10);
INSERT INTO request (from_account_id, to_account_id, amount) VALUES (2, 1, 20);