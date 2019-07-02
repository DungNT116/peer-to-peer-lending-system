INSERT INTO user (username, password, email, role, first_name, last_name, status) VALUES ('admin', 'admin', 'mail@admin.com', 'ROLE_ADMIN', 'minh', 'le', 'active');
INSERT INTO user (username, password, email, role, first_name, last_name, status, phone_number, loan_limit) VALUES ('user1', 'pass1', 'mail1', 'ROLE_USER', 'loc', 'hv', 'active', '0908070605', 5000);
INSERT INTO user (username, password, email, role, first_name, last_name, status, phone_number, loan_limit) VALUES ('user2', 'pass2', 'mail2', 'ROLE_USER', 'dung', 'nt', 'active', '0405060704', 2000);

INSERT INTO request (borrower_id, lender_id, amount, borrow_date, duration, interest_rate, create_date, status) VALUES (3, 2, 40, 3453463634, 120, 18, 345345345, 'done');
INSERT INTO request (borrower_id, amount, duration, interest_rate, create_date, status) VALUES (2, 100, 30, 18, 1235235235, 'pending');
INSERT INTO request (borrower_id, amount, duration, interest_rate, create_date, status) VALUES (3, 50, 60, 18, 234234234, 'pending');
INSERT INTO request (borrower_id, amount, duration, interest_rate, create_date, status) VALUES (2, 20, 90, 18, 54645645645, 'pending');

INSERT INTO deal (status, borrow_time, payback_time, request_id) VALUES ('done', 1, 1, 1);

INSERT INTO milestone(previous_date, present_date, type, deal_id) VALUES (345345345, 345345345, 'lend', 1);
INSERT INTO milestone(previous_date, present_date, type, deal_id) VALUES (345345345, 345345345, 'payback', 1);

INSERT INTO transaction(amount, create_date, receiver, sender, status, milestone_id) VALUES (40, 345345345, 'user2', 'user1', 'lend', 1);
INSERT INTO transaction(amount, create_date, receiver, sender, status, milestone_id) VALUES (40, 345345345, 'user1', 'user2', 'payback', 2);