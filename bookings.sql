

CREATE TABLE driver_details(
  driver_id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone INT,
  username VARCHAR(20) NOT NULL,
  FOREIGN KEY(username) REFERENCES accounts(username)
);

CREATE TABLE live_bookings(
  booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
  driver_id INTEGER,
  carReg TEXT NOT NULL,
  start_dateTime SMALLDATETIME NOT NULL,
  end_dateTime SMALLDATETIME NOT NULL,
  FOREIGN KEY(driver_id) REFERENCES driver_details(driver_id)
);
CREATE TABLE archive_bookings(
  booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
  driver_id INTEGER,
  car_reg TEXT NOT NULL,
  start_dateTime SMALLDATETIME NOT NULL,
  end_dateTime SMALLDATETIME NOT NULL,
  FOREIGN KEY(driver_id) REFERENCES driver_details(driver_id)
);
CREATE TABLE accounts(
  username VARCHAR(20) PRIMARY KEY,
  password_ VARCHAR(30) NOT NULL,
  admin_ INT NOT NULL
);
INSERT INTO accounts('username','password_','admin_')
  VALUES('admin','$2b$10$F85uZFhbkzOS.gxRdO9OUO9LOLHr8vLhy2Xfu9zyZamCmzZAXyeXC',1)

--INTO bookings('tushardev1','CV31 2DD','',category)
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




