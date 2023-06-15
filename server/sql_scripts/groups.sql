CREATE TABLE groups(
	id SERIAL PRIMARY KEY,
	name TEXT,
	creator_id INT,
	book_id INT, 
	FOREIGN KEY (creator_id) REFERENCES users(id),
	FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE group_members(
	group_id INT,
	member_id INT,
	FOREIGN KEY (group_id) REFERENCES groups(id),
	FOREIGN KEY (member_id) REFERENCES users(id)
);
