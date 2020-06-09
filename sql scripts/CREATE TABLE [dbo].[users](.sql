
-- Info about user, get from registration form
CREATE TABLE [dbo].[User](
	[UserId] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	[UserName] [varchar](50) NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[LastName] [varchar](50) NOT NULL,
	[Country] [varchar](50) NOT NULL,
	[Email] [varchar](50) NOT NULL,
	[ImageUrl] [varchar](MAX),
	PRIMARY KEY (UserName),
)

-- UserName-Password list for Login auth
CREATE TABLE [dbo].[Login](
	[UserId] [UNIQUEIDENTIFIER] NOT NULL,
	[UserName] [varchar](50) NOT NULL UNIQUE,
	[Password] [varchar](MAX) NOT NULL,
	PRIMARY KEY (UserId),
	FOREIGN KEY (UserId) REFERENCES [User](UserId)
)


-- f6d161fa-9578-46c9-b6a6-ee2d0a531b0c
-- select * from GeneralRecipe
-- select * from [dbo].[UserRecipe] 
-- select RecipeApiId from [dbo].[UserRecipe] where UserId = 'f6d161fa-9578-46c9-b6a6-ee2d0a531b0c' and isSaved = 1
-- select * from [Recipe]
-- select RecipeId from [Recipe] where AuthorUserId = 'f6d161fa-9578-46c9-b6a6-ee2d0a531b0c'


-- SELECT Recipe.* 
--  FROM Recipe 
--  FULL JOIN FamilyRecipe ON Recipe.RecipeId = FamilyRecipe.RecipeId
--  WHERE Recipe.AuthorUserId = '855eb12b-e310-497b-a66c-e88007dedc59' and FamilyRecipe.UserId is NULL


-- select * from IngredientsRecipe 
