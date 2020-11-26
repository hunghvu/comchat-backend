SELECT Members.MemberId,
	Members.Firstname,
	Members.Lastname,
	Members.Email
FROM Members,
	Contacts
INNER JOIN
	(
	SELECT Contacts.*
	FROM Contacts
	WHERE Contacts.MemberId_B = 9
	) AS c
	ON Contacts.MemberId_A = c.MemberId_B
	AND Contacts.MemberId_B = c.MemberId_A
WHERE Members.MemberId = c.MemberId_A