`CREATE PROCEDURE updateCancelStatus_upsert ( @invoice varchar(50), @cancel_status varchar(100), @username varchar(100), @comment varchar(8000) )
AS 
 
      
    UPDATE sessions
    SET
    cancel_status = @cancel_status,
    username = @username,
    updated_at = CURRENT_TIMESTAMP
    WHERE invoice = @invoice;

    INSERT INTO audit_history (invoice, username, comment, updated_at)
    VALUES ( @invoice, @username, @comment, CURRENT_TIMESTAMP);

  SELECT * FROM sessions WITH (UPDLOCK) WHERE invoice = @invoice

 
  RETURN  
`