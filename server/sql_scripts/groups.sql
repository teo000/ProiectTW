CREATE TABLE groups(
	id SERIAL PRIMARY KEY,
	name TEXT,
    invite_code TEXT,
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
select * from reviews

CREATE OR REPLACE FUNCTION set_invite_code()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.invite_code := MD5(random()::text || clock_timestamp()::text)::uuid;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_invite_code_trigger
  BEFORE INSERT ON groups
  FOR EACH ROW
  EXECUTE FUNCTION set_invite_code();
