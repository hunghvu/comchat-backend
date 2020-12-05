--Remove all memebers from all chats
DELETE FROM ChatMembers;

--Remove all messages from all chats
DELETE FROM Messages;

--Remove all chats
DELETE FROM Chats;

--Remove all contacts
DELETE FROM Contacts;

--Remove the user test1
DELETE FROM Members 
WHERE Email='test1@test.com';


--Add the User test1  (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt)
VALUES
    ('test1First', 'test1Last', 'test1', 'test1@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

--Remove the user test2
DELETE FROM Members 
WHERE Email='test2@test.com';

--Add the User test2  (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt)
VALUES
    ('test2First', 'test2Last', 'test2', 'test2@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

--Remove the user test3
DELETE FROM Members 
WHERE Email='test3@test.com';

--Add the User test3 (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt)
VALUES
    ('test3First', 'test3Last', 'test3', 'test3@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

--Remove the user test4
DELETE FROM Members 
WHERE Email='test4@test.com';

--Add the User test4 (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt)
VALUES
    ('test4First', 'test4Last', 'test4', 'test4@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

--Remove the user test5
DELETE FROM Members 
WHERE Email='test5@test.com';

--Add the User test5 (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt)
VALUES
    ('test5First', 'test5Last', 'test5', 'test5@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

--Remove the user test6
DELETE FROM Members 
WHERE Email='test6@test.com';

--Add the User test6 (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt)
VALUES
    ('test6First', 'test6Last', 'test6', 'test6@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

--Remove the user test7
DELETE FROM Members 
WHERE Email='test7@test.com';

--Add the User test7 (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt)
VALUES
    ('test7First', 'test7Last', 'test7', 'test7@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

--Remove the user test8
DELETE FROM Members 
WHERE Email='test8@test.com';

--Add the User test8 (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt)
VALUES
    ('test8First', 'test8Last', 'test8', 'test8@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

--Remove the user test9
DELETE FROM Members 
WHERE Email='test9@test.com';

--Add the User test9 (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt)
VALUES
    ('test9First', 'test9Last', 'test9', 'test9@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

--Remove the user test10
DELETE FROM Members 
WHERE Email='test10@test.com';

--Add the User test10 (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt)
VALUES
    ('test10First', 'test10Last', 'test10', 'test10@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

-- Create contacts between users
INSERT INTO
	Contacts(MemberID_A, MemberID_B, Verified)
VALUES
	(
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test1@test.com'),
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test2@test.com'),
	1
	);
	
INSERT INTO
	Contacts(MemberID_A, MemberID_B, Verified)
VALUES
	(
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test1@test.com'),
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test3@test.com'),
	1
	);
	
INSERT INTO
	Contacts(MemberID_A, MemberID_B, Verified)
VALUES
	(
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test1@test.com'),
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test4@test.com'),
	0
	);
	
INSERT INTO
	Contacts(MemberID_A, MemberID_B, Verified)
VALUES
	(
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test1@test.com'),
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test5@test.com'),
	0
	);
	
INSERT INTO
	Contacts(MemberID_A, MemberID_B, Verified)
VALUES
	(
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test6@test.com'),
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test1@test.com'),
	0
	);
	
INSERT INTO
	Contacts(MemberID_A, MemberID_B, Verified)
VALUES
	(
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test7@test.com'),
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test1@test.com'),
	0
	);
	
INSERT INTO
	Contacts(MemberID_A, MemberID_B, Verified)
VALUES
	(
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test8@test.com'),
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test1@test.com'),
	0
	);
	
INSERT INTO
	Contacts(MemberID_A, MemberID_B, Verified)
VALUES
	(
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test9@test.com'),
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test1@test.com'),
	0
	);
	
INSERT INTO
	Contacts(MemberID_A, MemberID_B, Verified)
VALUES
	(
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test1@test.com'),
	(SELECT Members.MemberId
		FROM Members
		WHERE Members.Email='test10@test.com'),
	0
	);
	
--Create Global Chat room, ChatId 1
INSERT INTO
    chats(chatid, name)
VALUES
    (1, 'Global Chat')
RETURNING *;

--Add the three test users to Global Chat
INSERT INTO 
    ChatMembers(ChatId, MemberId)
SELECT 1, Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
    OR Members.Email='test2@test.com'
    OR Members.Email='test3@test.com'
RETURNING *;

--Add Multiple messages to Group 1 create a conversation
INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Hi Group 1 this is member test1!',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Hi Group 1 this is member test2!',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Hi Group 1 this is member test3!',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'So how is everyone doing?',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Great, thanks for asking t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Enough with the pleasantries',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Lets get down to business',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'CHILL out t3 lol',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'OK ok. T2, what did you do since the last meeting?',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Nothing.',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Im completly blocked by t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Get your act together and finish the messaging end points',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Woah now. Im waiting on t1...',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'I had a mid-term. :-(',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;


INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'But lets keep this cordial please',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'So, t2, t3 is blocking you',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    '...and Im blocking t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'sounds like you get another day off.',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Nope. Im just going to do all the work myself',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'No way am I going to fail because fo you two. ',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Ok ok. No. Charles wont be happy with that.',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'My exam is over now. Ill get cracking on this thing',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'I can knoock it out tonight',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'If I get it by tmorrow AM',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'i can finish by the aftershock',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'aftershock',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'afternoon!!! stupid autocorrect',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Sounds like a plan',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'lets do it',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'lets dooooooo it',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    '3 2 1 Break',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'l8r',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;



--Create Global Chat room, ChatId 2
INSERT INTO
    chats(chatid, name)
VALUES
    (2, 'Global Chat')
RETURNING *;

--Add the three test users to Global Chat 2
INSERT INTO 
    ChatMembers(ChatId, MemberId)
SELECT 2, Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
    OR Members.Email='test2@test.com'
    OR Members.Email='test3@test.com'
RETURNING *;

--Add Multiple messages to Group 2 create a conversation
INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Hi Group 2 this is member test1!',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Hi Group 2 this is member test2!',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Hi Group 2 this is member test3!',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;



--Create Global Chat room, ChatId 3
INSERT INTO
    chats(chatid, name)
VALUES
    (3, 'Global Chat')
RETURNING *;

--Add the three test users to Global Chat 3
INSERT INTO 
    ChatMembers(ChatId, MemberId)
SELECT 3, Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
    OR Members.Email='test2@test.com'
    OR Members.Email='test3@test.com'
RETURNING *;

--Add Multiple messages to Group 3 create a conversation
INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Hi Group 3 this is member test1!',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Hi Group 3 this is member test2!',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Hi Group 3 this is member test3!',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;