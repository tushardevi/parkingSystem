CREATE TABLE IF NOT EXISTS LiveBookings(
  booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username INTEGER,
  carReg TEXT NOT NULL,
  start_dateTime SMALLDATETIME NOT NULL,
  end_dateTime SMALLDATETIME NOT NULL,
  FOREIGN KEY(username) REFERENCES DriverDetails(username)
);



-- random values to test the database


-- INSERT INTO bookings('tushardev1','CV31 2DD','',category)
--   VALUES(5,CURRENT_TIMESTAMP,"Picnic",120.50,"holiday","luxury");
  
-- INSERT INTO expenses(userid, expense_date,label,amount,descrip,img_url,category)
--   VALUES(5,CURRENT_TIMESTAMP,"Party",20.50,"Pub night","avatr.png","Luxury");
  
-- INSERT INTO expenses(userid, expense_date,label,amount,descrip,img_url,category)
--   VALUES(5,CURRENT_TIMESTAMP,"Car",20.50,"car bought","avatr.png","Other");
  
  
  
-- INSERT INTO expenses(userid, expense_date,label,amount)
--   VALUES(24,"01/10/2020"," ",59.99);

-- INSERT INTO expenses(userid, expense_date,label,amount)
--   VALUES(5,"01/09/2020"," ",120.50);
  
  
  

-- INSERT INTO contacts(userid,firstname,lastname,company,url,photo,lastcontact)
--   VALUES(24,"Fred","Flinstone","hanna honanaa","https://www.youtube.com","image_2.jpg",CURRENT_TIMESTAMP);




