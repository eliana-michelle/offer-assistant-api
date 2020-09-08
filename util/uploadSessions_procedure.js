`CREATE PROCEDURE uploadSessions (@invoice varchar(50), @office varchar(50), @cancel_status varchar(500), @first_name varchar(500), @last_name varchar(500), @offer_code varchar(50), @offer_description varchar(1000), @letter_sent datetime, @expiration_date datetime)
AS 
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  BEGIN TRAN
 
    IF NOT EXISTS ( SELECT * FROM sessions WITH (UPDLOCK) WHERE invoice = @invoice )

      INSERT sessions (invoice, office, cancel_status, first_name, last_name, offer_code, offer_description, letter_sent, expiration_date )
      VALUES ( @invoice, @office, @cancel_status, @first_name, @last_name, @offer_code, @offer_description, @letter_sent, @expiration_date );

  COMMIT 
`