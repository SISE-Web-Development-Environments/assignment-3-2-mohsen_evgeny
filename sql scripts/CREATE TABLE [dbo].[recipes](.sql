-- Create recipe by user(author)
CREATE TABLE [dbo].[Recipe](
	[RecipeId] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	[RecipeName] [varchar](50) NOT NULL,
	[AuthorUserId] [UNIQUEIDENTIFIER] NOT NULL,
	[Duration] [INT] NOT NULL,
	[Servings] [INT] NOT NULL DEFAULT 0, -- how big the exit product
	[Likes] [INT] NOT NULL DEFAULT 0,
	[isVegetarian] [BIT] NOT NULL DEFAULT 0,
	[isVegan] [BIT] NOT NULL DEFAULT 0,
	[isGlutenFree] [BIT] NOT NULL DEFAULT 0,
	[ImageUrl] [varchar](MAX),
	PRIMARY KEY (RecipeId),
	FOREIGN KEY (AuthorUserId) REFERENCES [Login](UserId)
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
	[number] [INT] NOT NULL,
	[step] [varchar](MAX) NOT NULL,
	PRIMARY KEY (RecipeId, StepNumber),
	FOREIGN KEY (RecipeId) REFERENCES [Recipe](RecipeId)
)


-- interaction of a user with a recipe: if user saw it or/and added it to favorites
CREATE TABLE [dbo].[UserRecipe](
	[UserId] [UNIQUEIDENTIFIER] NOT NULL,
	[RecipeApiId] [INT] NOT NULL,
	[isWatched] [BIT] NOT NULL DEFAULT 1,
	[isSaved] [BIT] NOT NULL DEFAULT 0,
	PRIMARY KEY (UserId, RecipeApiId),
	FOREIGN KEY (UserId) REFERENCES [Login](UserId),
)

CREATE TABLE [dbo].[FamilyRecipe](
	[UserId] [UNIQUEIDENTIFIER] NOT NULL,
	[RecipeId] [UNIQUEIDENTIFIER] NOT NULL,
	[Origin] [varchar](50) NOT NULL, -- whose the recipe in family
	[Reason] [varchar](50) NOT NULL, -- cause to coook the dish
	[ImageUrl] [varchar](MAX) NOT NULL, -- family pictures with the dish
	PRIMARY KEY (UserId, RecipeId),
	FOREIGN KEY (UserId) REFERENCES [Login](UserId),
	FOREIGN KEY (RecipeId) REFERENCES Recipe(RecipeId),
)

/*
-- List of Cuisines for search
CREATE TABLE [dbo].[Cuisine](
	[CuisineName] [varchar](50) NOT NULL,
	PRIMARY KEY (Cuisine)
)

-- Recipe by Cuisines for search
CREATE TABLE [dbo].[CuisineRecipe](
	[RecipeId] [UNIQUEIDENTIFIER] NOT NULL,
	[CuisineName] [varchar](50) NOT NULL,
	PRIMARY KEY (RecipeId, Cuisine),
	FOREIGN KEY (RecipeId) REFERENCES [Recipe](RecipeId)
	FOREIGN KEY (CuisineName) REFERENCES [Cuisine](CuisineName)
)

-- List of Diets for search
CREATE TABLE [dbo].[Diet](
	[DietName] [varchar](50) NOT NULL,
	PRIMARY KEY (DietName)
)

-- Recipe by Diet
CREATE TABLE [dbo].[DietRecipe](
	[RecipeId] [UNIQUEIDENTIFIER] NOT NULL,
	[DietName] [varchar](50) NOT NULL,
	PRIMARY KEY (RecipeId, DietName),
	FOREIGN KEY (RecipeId) REFERENCES [Recipe](RecipeId)
	FOREIGN KEY (DietName) REFERENCES [Diet](DietName)
)

-- List of Diets for search
CREATE TABLE [dbo].[Intolerance](
	[IntoleranceName] [varchar](50) NOT NULL,
	PRIMARY KEY (IntoleranceName)
)

-- Recipe by Diet
CREATE TABLE [dbo].[intoleranceRecipe](
	[RecipeId] [UNIQUEIDENTIFIER] NOT NULL,
	[IntoleranceName] [varchar](50) NOT NULL,
	PRIMARY KEY (RecipeId, IntoleranceName),
	FOREIGN KEY (RecipeId) REFERENCES [Recipe](RecipeId)
	FOREIGN KEY (IntoleranceName) REFERENCES [Intolerance](IntoleranceName)
)
*/