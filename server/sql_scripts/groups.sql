CREATE TABLE groups(
	id SERIAL PRIMARY KEY,
	name TEXT,
	creator_id INT,
	book_id INT, 
	FOREIGN KEY (creator_id) REFERENCES users(id),
	FOREIGN KEY (book_id) REFERENCES books(id)
);

ALTER TABLE groups ADD COLUMN invite_code TEXT;

CREATE TABLE group_members(
	group_id INT,
	member_id INT,
	FOREIGN KEY (group_id) REFERENCES groups(id),
	FOREIGN KEY (member_id) REFERENCES users(id)
);
select * from reviews

DELETE FROM groups WHERE id = 1;
SELECT * FROM group_members;
DELETE FROM group_members;
SELECT * from users;

SELECT * FROM groups;
SELECT g.id, g.name, g.creator_id, g.book_id, g.invite_code, (g.creator_id = 4) AS is_owner FROM groups g 
NATURAL JOIN group_members gm JOIN books b on g.book_id = b.id where gm.member_id = 9;

INSERT INTO group_members (group_id, member_id) VALUES (2, 9);


INSERT INTO GROUPS(creator_id, book_id, name) VALUES (4, 40607, 'Grupul meu smecher');

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
