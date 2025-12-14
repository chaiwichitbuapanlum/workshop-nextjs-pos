BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Product] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [cost] FLOAT(53) NOT NULL CONSTRAINT [Product_cost_df] DEFAULT 0,
    [basePrice] FLOAT(53) NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [sole] INT NOT NULL CONSTRAINT [Product_sole_df] DEFAULT 0,
    [stock] INT NOT NULL CONSTRAINT [Product_stock_df] DEFAULT 0,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Product_status_df] DEFAULT 'Active',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Product_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [categoryId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [Product_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[Category]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
