create table group_books --history of the books read in a group
( groupID integer not null,
  bookID integer not null,
  Date DATE,
  FOREIGN KEY (groupID) REFERENCES groups(id) on delete cascade,
  FOREIGN KEY (bookID) REFERENCES books(id) on delete cascade
);