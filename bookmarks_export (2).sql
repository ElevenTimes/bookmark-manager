-- Bookmark Full Export
-- Date: 2025-06-17T15:10:43.242Z
-- Bookmarks: 13, Folders: 4, Keywords: 4

INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('182fae79-ee31-4fa4-85b7-c4c74f52b3c3', 'https://www.example.com', '3', '2025-06-17 15:08:46', NULL) ON DUPLICATE KEY UPDATE link='https://www.example.com', description='3', date='2025-06-17 15:08:46';
INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('362623b8-3f07-462b-875c-5b7b7c9c1225', 'https://www.example.com', '8', '2025-06-17 15:09:11', NULL) ON DUPLICATE KEY UPDATE link='https://www.example.com', description='8', date='2025-06-17 15:09:11';
INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('46244840-c553-45d8-8eeb-92fe232e980c', 'https://www.example.com', '2', '2025-06-17 15:08:44', NULL) ON DUPLICATE KEY UPDATE link='https://www.example.com', description='2', date='2025-06-17 15:08:44';
INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('484630f7-deeb-45ac-9bbd-1b34ff11af7d', 'https://www.example.com', '7', '2025-06-17 15:09:05', NULL) ON DUPLICATE KEY UPDATE link='https://www.example.com', description='7', date='2025-06-17 15:09:05';
INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('4847d7b3-f5df-48e7-a848-cdcfe4aee929', 'https://www.youtube.com/watch?v=JhkIRzZsZvw', 'duality', '2025-06-15 10:45:06', NULL) ON DUPLICATE KEY UPDATE link='https://www.youtube.com/watch?v=JhkIRzZsZvw', description='duality', date='2025-06-15 10:45:06';
INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('57341f5f-e410-41f8-afe6-4e33901c6774', 'https://www.example.com', '10', '2025-06-17 15:09:22', NULL) ON DUPLICATE KEY UPDATE link='https://www.example.com', description='10', date='2025-06-17 15:09:22';
INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('63068bf2-90e6-4f2a-be2a-d2c9b57ab5d3', 'https://www.example.com', '9', '2025-06-17 15:09:17', NULL) ON DUPLICATE KEY UPDATE link='https://www.example.com', description='9', date='2025-06-17 15:09:17';
INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('6fc85832-b10e-4349-bf80-6f457704541c', 'https://www.example.com', '4', '2025-06-17 15:08:53', NULL) ON DUPLICATE KEY UPDATE link='https://www.example.com', description='4', date='2025-06-17 15:08:53';
INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('6fdc5e4a-dae0-4196-bd6a-8a78f4b54796', 'https://www.pianochord.org/em.html', 'piano', '2025-06-14 14:45:14', NULL) ON DUPLICATE KEY UPDATE link='https://www.pianochord.org/em.html', description='piano', date='2025-06-14 14:45:14';
INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('72470174-60ea-4352-a047-41379fc42415', 'https://www.example.com', '1', '2025-06-17 15:08:42', NULL) ON DUPLICATE KEY UPDATE link='https://www.example.com', description='1', date='2025-06-17 15:08:42';
INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('77e11b8f-22a2-45ea-9e32-91d3c6992cf1', 'https://www.swedbank.lv/private', 'galvena bankas', '2025-06-11 10:51:45', NULL) ON DUPLICATE KEY UPDATE link='https://www.swedbank.lv/private', description='galvena bankas', date='2025-06-11 10:51:45';
INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('949fdc4b-6f75-445e-9538-6dd2abdda5f1', 'https://www.example.com', '6', '2025-06-17 15:09:00', NULL) ON DUPLICATE KEY UPDATE link='https://www.example.com', description='6', date='2025-06-17 15:09:00';
INSERT INTO bookmark (id, link, description, date, bookmarkListId) VALUES ('f9ae1a57-488d-4fa0-929b-2f0c4e0bbbde', 'https://www.example.com', '5', '2025-06-17 15:08:57', NULL) ON DUPLICATE KEY UPDATE link='https://www.example.com', description='5', date='2025-06-17 15:08:57';

-- Folders
INSERT INTO folder (id, name, bookmarkListId) VALUES ('43a97f2d-9f9a-4f28-a4db-b4714eb24ea7', 'music', NULL) ON DUPLICATE KEY UPDATE name='music';
INSERT INTO folder (id, name, bookmarkListId) VALUES ('all', 'All', NULL) ON DUPLICATE KEY UPDATE name='All';
INSERT INTO folder (id, name, bookmarkListId) VALUES ('d900f0a1-6a34-48d3-baf4-17ca6e04dd4a', 'bankas', NULL) ON DUPLICATE KEY UPDATE name='bankas';
INSERT INTO folder (id, name, bookmarkListId) VALUES ('fcadfb77-9b94-439d-96d7-05808a02c200', 'examples', NULL) ON DUPLICATE KEY UPDATE name='examples';

-- Keywords
INSERT INTO keyword (id, name) VALUES ('148fc6dd-8beb-4021-8a4e-4a032e9b391d', 'music') ON DUPLICATE KEY UPDATE name='music';
INSERT INTO keyword (id, name) VALUES ('4d588617-a0b1-48a5-9d67-6e74e60cf4f1', 'blue') ON DUPLICATE KEY UPDATE name='blue';
INSERT INTO keyword (id, name) VALUES ('bcd7ea4f-fc5d-446b-a5f6-babb916757b7', 'nike') ON DUPLICATE KEY UPDATE name='nike';
INSERT INTO keyword (id, name) VALUES ('cc1d644a-c80d-4063-8df7-0dbfa7a4f1c0', 'coding') ON DUPLICATE KEY UPDATE name='coding';

-- Bookmark-Folder Links
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('4847d7b3-f5df-48e7-a848-cdcfe4aee929', '43a97f2d-9f9a-4f28-a4db-b4714eb24ea7') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('6fdc5e4a-dae0-4196-bd6a-8a78f4b54796', '43a97f2d-9f9a-4f28-a4db-b4714eb24ea7') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('182fae79-ee31-4fa4-85b7-c4c74f52b3c3', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('362623b8-3f07-462b-875c-5b7b7c9c1225', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('46244840-c553-45d8-8eeb-92fe232e980c', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('484630f7-deeb-45ac-9bbd-1b34ff11af7d', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('4847d7b3-f5df-48e7-a848-cdcfe4aee929', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('57341f5f-e410-41f8-afe6-4e33901c6774', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('63068bf2-90e6-4f2a-be2a-d2c9b57ab5d3', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('6fc85832-b10e-4349-bf80-6f457704541c', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('6fdc5e4a-dae0-4196-bd6a-8a78f4b54796', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('72470174-60ea-4352-a047-41379fc42415', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('77e11b8f-22a2-45ea-9e32-91d3c6992cf1', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('949fdc4b-6f75-445e-9538-6dd2abdda5f1', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('f9ae1a57-488d-4fa0-929b-2f0c4e0bbbde', 'all') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('77e11b8f-22a2-45ea-9e32-91d3c6992cf1', 'd900f0a1-6a34-48d3-baf4-17ca6e04dd4a') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('182fae79-ee31-4fa4-85b7-c4c74f52b3c3', 'fcadfb77-9b94-439d-96d7-05808a02c200') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('362623b8-3f07-462b-875c-5b7b7c9c1225', 'fcadfb77-9b94-439d-96d7-05808a02c200') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('46244840-c553-45d8-8eeb-92fe232e980c', 'fcadfb77-9b94-439d-96d7-05808a02c200') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('484630f7-deeb-45ac-9bbd-1b34ff11af7d', 'fcadfb77-9b94-439d-96d7-05808a02c200') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('57341f5f-e410-41f8-afe6-4e33901c6774', 'fcadfb77-9b94-439d-96d7-05808a02c200') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('63068bf2-90e6-4f2a-be2a-d2c9b57ab5d3', 'fcadfb77-9b94-439d-96d7-05808a02c200') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('6fc85832-b10e-4349-bf80-6f457704541c', 'fcadfb77-9b94-439d-96d7-05808a02c200') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('72470174-60ea-4352-a047-41379fc42415', 'fcadfb77-9b94-439d-96d7-05808a02c200') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('949fdc4b-6f75-445e-9538-6dd2abdda5f1', 'fcadfb77-9b94-439d-96d7-05808a02c200') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_folder (bookmarkId, folderId) VALUES ('f9ae1a57-488d-4fa0-929b-2f0c4e0bbbde', 'fcadfb77-9b94-439d-96d7-05808a02c200') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;

-- Bookmark-Keyword Links
INSERT INTO bookmark_keyword (bookmarkId, keywordId) VALUES ('4847d7b3-f5df-48e7-a848-cdcfe4aee929', '148fc6dd-8beb-4021-8a4e-4a032e9b391d') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_keyword (bookmarkId, keywordId) VALUES ('6fdc5e4a-dae0-4196-bd6a-8a78f4b54796', '148fc6dd-8beb-4021-8a4e-4a032e9b391d') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_keyword (bookmarkId, keywordId) VALUES ('57341f5f-e410-41f8-afe6-4e33901c6774', '4d588617-a0b1-48a5-9d67-6e74e60cf4f1') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_keyword (bookmarkId, keywordId) VALUES ('77e11b8f-22a2-45ea-9e32-91d3c6992cf1', '4d588617-a0b1-48a5-9d67-6e74e60cf4f1') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
INSERT INTO bookmark_keyword (bookmarkId, keywordId) VALUES ('77e11b8f-22a2-45ea-9e32-91d3c6992cf1', 'cc1d644a-c80d-4063-8df7-0dbfa7a4f1c0') ON DUPLICATE KEY UPDATE bookmarkId=bookmarkId;
