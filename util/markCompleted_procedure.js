`CREATE PROCEDURE markCompleted_procedure ( @invoice varchar(100), @username varchar(5000), @comment varchar(8000))
AS 
  UPDATE sessions
    SET
    completed = 1,
    completed_at = CURRENT_TIMESTAMP
    WHERE invoice = @invoice AND charge_back = 1;

    INSERT INTO audit_history (invoice, username, comment, updated_at)
      VALUES ( @invoice, @username, @comment, CURRENT_TIMESTAMP);

    SELECT * FROM sessions WHERE invoice = @invoice

    RETURN
 `