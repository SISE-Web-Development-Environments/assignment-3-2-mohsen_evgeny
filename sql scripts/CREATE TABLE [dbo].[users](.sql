-- UserName-Password list for Login auth
CREATE TABLE [dbo].[Login](
	[UserId] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	[UserName] [varchar](50) NOT NULL UNIQUE,
	[Password] [varchar](MAX) NOT NULL,
	PRIMARY KEY ([UserId]),
)

-- Info about user, get from registration form
CREATE TABLE [dbo].[User](
	[UserId] [UNIQUEIDENTIFIER] NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[LastName] [varchar](50) NOT NULL,
	[Country] [varchar](50) NOT NULL,
	[Email] [varchar](50) NOT NULL,
	[ImageUrl] [varchar](MAX),
--	[WatchedRecipeIds] [varchar](MAX),
	PRIMARY KEY ([UserId]),
	FOREIGN KEY ([UserId]) REFERENCES [Login]([UserId])
)



/*
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
*/

-- f6d161fa-9578-46c9-b6a6-ee2d0a531b0c
-- select * from GeneralRecipe
-- select * from [dbo].[UserRecipe] 
-- select RecipeApiId from [dbo].[UserRecipe] where UserId = 'f6d161fa-9578-46c9-b6a6-ee2d0a531b0c' and isSaved = 1
-- select * from [Recipe]
select RecipeId from [Recipe] where AuthorUserId = 'f6d161fa-9578-46c9-b6a6-ee2d0a531b0c'

