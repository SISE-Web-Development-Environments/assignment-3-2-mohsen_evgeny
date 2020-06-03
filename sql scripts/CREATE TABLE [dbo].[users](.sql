-- Info about user, get from /registration form
CREATE TABLE [dbo].[User](
--	[UserId] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	[UserName] [varchar](50) NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[LastName] [varchar](50) NOT NULL,
	[Country] [varchar](50) NOT NULL,
	[Email] [varchar](50) NOT NULL,
	PRIMARY KEY (UserName),
)



-- Login-password list for auth
CREATE TABLE [dbo].[Login](
	[UserName] [varchar](50) NOT NULL,
	[Password] [varchar](50) NOT NULL,
	PRIMARY KEY (UserName, Password),
	FOREIGN KEY (UserName) REFERENCES [User](UserName)
)