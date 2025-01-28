SELECT Punch_ID, User, Location, Machine, Year, Month, Day, Hour, Minute, Second
FROM hubska
UNION ALL
SELECT Punch_ID, User, Location, Machine, Year, Month, Day, Hour, Minute, Second
FROM legnicka
UNION ALL
SELECT Punch_ID, User, Location, Machine, Year, Month, Day, Hour, Minute, Second
FROM jednosci
UNION ALL
SELECT Punch_ID, User, Location, Machine, Year, Month, Day, Hour, Minute, Second
FROM pugeta 
WHERE Year = 2025
ORDER BY Year, Month, Day, Hour, Minute, Second;

