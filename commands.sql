CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INT DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Oblo', 'www.example.com/1', 'Prvi blog');

INSERT INTO blogs (author, url, title) VALUES ('Kocko', 'www.example.com/2', 'Drugi blog');