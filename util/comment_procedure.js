`CREATE PROCEDURE comment_upsert( @invoice varchar(50), @comment varchar(8000), @username varchar(500))
AS 
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  BEGIN TRAN
  
      INSERT INTO comments (invoice, comment, username)
      VALUES (@invoice, @comment, @username)

  COMMIT 
`