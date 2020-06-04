-- Create recipe by user(author)
CREATE TABLE [dbo].[Recipe](
	[RecipeId] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	[RecipeName] [varchar](50) NOT NULL,
	[Author] [varchar](50) NOT NULL,
	PRIMARY KEY (RecipeId),
	FOREIGN KEY (Author) REFERENCES [User](UserName)
)

-- General info about recipe
CREATE TABLE [dbo].[GeneralRecipe](
	[RecipeId] [UNIQUEIDENTIFIER] NOT NULL,
	[Duration] [INT] NOT NULL,
	[Diners] [INT] NOT NULL DEFAULT 0, -- how big the exit product
	[Likes] [INT] NOT NULL DEFAULT 0,
	[isVegetarian] [BIT] NOT NULL DEFAULT 0,
	[isVegan] [BIT] NOT NULL DEFAULT 0,
	[isGlutenFree] [BIT] NOT NULL DEFAULT 0,
	[ImageUrl] [varchar](MAX),
	[isClickableImage] [BIT] NOT NULL DEFAULT 0,
	PRIMARY KEY (RecipeId),
	FOREIGN KEY (RecipeId) REFERENCES [Recipe](RecipeId)
)

-- Ingredients and its amount for a recipe
CREATE TABLE [dbo].[IngredientsRecipe](
	[RecipeId] [UNIQUEIDENTIFIER] NOT NULL,
	[Ingredient] [varchar](50) NOT NULL,
	[Amount] [INT] NOT NULL DEFAULT 0,
	PRIMARY KEY (RecipeId, Ingredient),
	FOREIGN KEY (RecipeId) REFERENCES [Recipe](RecipeId)
)

-- How to cook a recipe
CREATE TABLE [dbo].[InstructionsRecipe](
	[RecipeId] [UNIQUEIDENTIFIER] NOT NULL,
	[StepNumber] [INT] NOT NULL,
	[StepDescription] [varchar](MAX) NOT NULL,
	PRIMARY KEY (RecipeId, StepNumber),
	FOREIGN KEY (RecipeId) REFERENCES [Recipe](RecipeId)
)


-- interaction of a user with a recipe: if user saw it or/and added it to favorites
CREATE TABLE [dbo].[UserRecipe](
	[UserName] [varchar](50) NOT NULL,
	[RecipeId] [UNIQUEIDENTIFIER] NOT NULL,
	[isWatched] [BIT] NOT NULL DEFAULT 1,
	[isSaved] [BIT] NOT NULL DEFAULT 0,
	PRIMARY KEY (UserName, RecipeId),
	FOREIGN KEY (UserName) REFERENCES [User](UserName),
	FOREIGN KEY (RecipeId) REFERENCES Recipe(RecipeId),
)

CREATE TABLE [dbo].[FamilyRecipe](
	[UserName] [varchar](50) NOT NULL,
	[RecipeId] [UNIQUEIDENTIFIER] NOT NULL,
	[Origin] [varchar](50) NOT NULL, -- whose the recipe in family
	[Reason] [varchar](50) NOT NULL, -- cause to coook the dish
	[ImageUrl] [varchar](MAX) NOT NULL, -- family pictures with the dish
	PRIMARY KEY (UserName, RecipeId),
	FOREIGN KEY (UserName) REFERENCES [User](UserName),
	FOREIGN KEY (RecipeId) REFERENCES Recipe(RecipeId),
)