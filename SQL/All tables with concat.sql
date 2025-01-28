SELECT 
    Punch_ID, 
    User, 
    Location, 
    Machine, 
    CONCAT(LPAD(Day, 2, '0'), '-', LPAD(Month, 2, '0'), '-', Year) AS Date,
    CONCAT(LPAD(Hour, 2, '0'), ':', LPAD(Minute, 2, '0'), ':', LPAD(Second, 2, '0')) AS Time
FROM hubska
UNION ALL
SELECT 
    Punch_ID, 
    User, 
    Location, 
    Machine, 
    CONCAT(LPAD(Day, 2, '0'), '-', LPAD(Month, 2, '0'), '-', Year) AS Date,
    CONCAT(LPAD(Hour, 2, '0'), ':', LPAD(Minute, 2, '0'), ':', LPAD(Second, 2, '0')) AS Time
FROM legnicka
UNION ALL
SELECT 
    Punch_ID, 
    User, 
    Location, 
    Machine,
   CONCAT(LPAD(Day, 2, '0'), '-', LPAD(Month, 2, '0'), '-', Year) AS Date,
    CONCAT(LPAD(Hour, 2, '0'), ':', LPAD(Minute, 2, '0'), ':', LPAD(Second, 2, '0')) AS Time
FROM jednosci
UNION ALL
SELECT 
    Punch_ID, 
    User, 
    Location, 
    Machine, 
    CONCAT(LPAD(Day, 2, '0'), '-', LPAD(Month, 2, '0'), '-', Year) AS Date,
    CONCAT(LPAD(Hour, 2, '0'), ':', LPAD(Minute, 2, '0'), ':', LPAD(Second, 2, '0')) AS Time
FROM pugeta;
