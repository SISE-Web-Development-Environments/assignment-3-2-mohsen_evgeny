-- Info about user, get from registration form
CREATE TABLE [dbo].[User](
--	[UserId] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	[UserName] [varchar](50) NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[LastName] [varchar](50) NOT NULL,
	[Country] [varchar](50) NOT NULL,
	[Email] [varchar](50) NOT NULL,
	[ImageUrl] [varchar](MAX),
--	[WatchedRecipeIds] [varchar](MAX),
	PRIMARY KEY (UserName),
)

-- UserName-Password list for Login auth
CREATE TABLE [dbo].[Login](
	[UserName] [varchar](50) NOT NULL,
	[Password] [varchar](MAX) NOT NULL,
	PRIMARY KEY (UserName),
	FOREIGN KEY (UserName) REFERENCES [User](UserName)
)