SELECT Members.MemberId,
	Members.Firstname,
	Members.Lastname,
	Members.Email
FROM Members,
	(
	SELECT Contacts.*
	FROM 
		Contacts
	WHERE Contacts.MemberId_A = 9
	EXCEPT
	SELECT Contacts.*
	FROM 
		Contacts
	INNER JOIN
		(
		SELECT Contacts.*
		FROM Contacts
		WHERE Contacts.MemberId_B = 9
		) AS c
		ON Contacts.MemberId_A = c.MemberId_B
			AND Contacts.MemberId_B = c.MemberId_A
	) AS cont
WHERE Members.MemberId = cont.MemberId_B