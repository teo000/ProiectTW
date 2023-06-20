create table group_books --history of the books read in a group
( groupID integer not null,
  bookID integer not null,
  Date DATE,
  FOREIGN KEY (groupID) REFERENCES groups(id) on delete cascade,
  FOREIGN KEY (bookID) REFERENCES books(id) on delete cascade
);
create table reviews(
                        id serial primary key,
                        userID integer not null,
                        bookID integer not null,
						isGeneric bool,
                        Date DATE,
                        content varchar(320),--punem limita la frontend
                        stars integer,
                        likes integer,
                        FOREIGN KEY (userID) REFERENCES users(id) on delete cascade,
                        FOREIGN KEY (bookID) REFERENCES books(id) on delete cascade
);
SELECT * FROM books where id = 1

create table user_books(
	bookid integer,
	userid integer,
	rating numeric(3, 2),
	shelf varchar(50),
	FOREIGN KEY (userid) REFERENCES users(id) on delete cascade,
   	FOREIGN KEY (bookid) REFERENCES books(id) on delete cascade
);
