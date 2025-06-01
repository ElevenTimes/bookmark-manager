DROP TABLE IF EXISTS bookmark_keyword;
DROP TABLE IF EXISTS bookmark_folder;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS bookmark;
DROP TABLE IF EXISTS folder;
DROP TABLE IF EXISTS keyword;
DROP TABLE IF EXISTS bookmarkList;



CREATE TABLE bookmarkList (
  listId CHAR(36) PRIMARY KEY
);

CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  bookmarkListId CHAR(36),
  FOREIGN KEY (bookmarkListId) REFERENCES bookmarkList(listId) ON DELETE CASCADE
);

CREATE TABLE bookmark (
  id CHAR(36) PRIMARY KEY,
  link VARCHAR(255) NOT NULL,
  description TEXT,
  date DATETIME,
  bookmarkListId CHAR(36),
  FOREIGN KEY (bookmarkListId) REFERENCES bookmarkList(listId) ON DELETE CASCADE
);

CREATE TABLE keyword (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE folder (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bookmarkListId CHAR(36),
  FOREIGN KEY (bookmarkListId) REFERENCES bookmarkList(listId) ON DELETE CASCADE
);

CREATE TABLE bookmark_keyword (
  bookmarkId CHAR(36),
  keywordId CHAR(36),
  PRIMARY KEY (bookmarkId, keywordId),
  FOREIGN KEY (bookmarkId) REFERENCES bookmark(id) ON DELETE CASCADE,
  FOREIGN KEY (keywordId) REFERENCES keyword(id) ON DELETE CASCADE
);

CREATE TABLE bookmark_folder (
  bookmarkId CHAR(36),
  folderId CHAR(36),
  PRIMARY KEY (bookmarkId, folderId),
  FOREIGN KEY (bookmarkId) REFERENCES bookmark(id) ON DELETE CASCADE,
  FOREIGN KEY (folderId) REFERENCES folder(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_list ON users(bookmarkListId);
CREATE INDEX idx_bookmark_list ON bookmark(bookmarkListId);
CREATE INDEX idx_folder_list ON folder(bookmarkListId);

INSERT INTO folder (id, name) VALUES ('all', 'All')
ON DUPLICATE KEY UPDATE name = 'All';
