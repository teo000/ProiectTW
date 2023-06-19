CREATE TABLE reviews(
	id SERIAL PRIMARY KEY,
	userid INT,
	content TEXT,
	stars INT,
	date DATE,
	isgeneric BOOL,
	CONSTRAINT fk_reviews_users
		FOREIGN KEY(userid) 
			REFERENCES users(id)
);

ALTER TABLE reviews ADD COLUMN bookid INT;
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_books
		FOREIGN KEY(bookid) 
			REFERENCES books(id);


