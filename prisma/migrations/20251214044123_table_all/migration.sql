/*
  Warnings:

  - You are about to drop the column `sole` on the `Product` table. All the data in the column will be lost.
  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Product] DROP CONSTRAINT [Product_stock_df];
ALTER TABLE [dbo].[Product] ALTER COLUMN [description] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Product] DROP COLUMN [sole];
ALTER TABLE [dbo].[Product] ADD [sold] INT NOT NULL CONSTRAINT [Product_sold_df] DEFAULT 0;

-- CreateTable
CREATE TABLE [dbo].[ProductImage] (
    [id] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [fileId] NVARCHAR(1000) NOT NULL,
    [isMain] BIT NOT NULL CONSTRAINT [ProductImage_isMain_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ProductImage_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [productId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ProductImage_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Cart] (
    [id] NVARCHAR(1000) NOT NULL,
    [cartTotal] FLOAT(53) NOT NULL CONSTRAINT [Cart_cartTotal_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Cart_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [orderedById] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Cart_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CartItem] (
    [id] NVARCHAR(1000) NOT NULL,
    [count] INT NOT NULL CONSTRAINT [CartItem_count_df] DEFAULT 1,
    [price] FLOAT(53) NOT NULL,
    [cartId] NVARCHAR(1000) NOT NULL,
    [productId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [CartItem_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Order] (
    [id] NVARCHAR(1000) NOT NULL,
    [orderNumber] NVARCHAR(1000) NOT NULL,
    [totalAmount] FLOAT(53) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Order_status_df] DEFAULT 'Pending',
    [paymentImage] NVARCHAR(1000),
    [paymentAt] DATETIME2,
    [address] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [note] NVARCHAR(1000),
    [shippingFee] FLOAT(53) NOT NULL CONSTRAINT [Order_shippingFee_df] DEFAULT 0,
    [trackingNumber] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Order_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [customerId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Order_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[OrderItem] (
    [id] NVARCHAR(1000) NOT NULL,
    [quantity] INT NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [totalPirce] FLOAT(53) NOT NULL,
    [productTitle] NVARCHAR(1000) NOT NULL,
    [productImage] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [OrderItem_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [orderId] NVARCHAR(1000) NOT NULL,
    [productId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [OrderItem_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProductImage] ADD CONSTRAINT [ProductImage_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Cart] ADD CONSTRAINT [Cart_orderedById_fkey] FOREIGN KEY ([orderedById]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CartItem] ADD CONSTRAINT [CartItem_cartId_fkey] FOREIGN KEY ([cartId]) REFERENCES [dbo].[Cart]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CartItem] ADD CONSTRAINT [CartItem_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
