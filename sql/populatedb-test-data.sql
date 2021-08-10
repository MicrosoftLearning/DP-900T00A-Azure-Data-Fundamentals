CREATE TABLE Inventory (
	Id int PRIMARY KEY, 
	Name VARCHAR(50), 
	Stock INTEGER
);

CREATE TABLE CustomerOrder (
	Id int PRIMARY KEY, 
	CustomerName VARCHAR(50),
    Quantity int,
    Created DATETIME,
    InventoryId int FOREIGN KEY REFERENCES Inventory(Id)
);

INSERT INTO Inventory (Id, Name, Stock) VALUES (1, 'banana', 150); 
INSERT INTO Inventory (Id, Name, Stock) VALUES (2, 'orange', 154);
INSERT INTO Inventory (Id, Name, Stock) VALUES (3, 'apple', 23); 
INSERT INTO Inventory (Id, Name, Stock) VALUES (4, 'lemon', 254);


INSERT INTO CustomerOrder(Id, CustomerName, InventoryId, Quantity, Created) VALUES (1, 'John Smith', 2, 5, getdate());
INSERT INTO CustomerOrder(Id, CustomerName, InventoryId, Quantity, Created) VALUES (2, 'Jane Brown', 2, 8, getdate());
INSERT INTO CustomerOrder(Id, CustomerName, InventoryId, Quantity, Created) VALUES (3, 'Stephen Stone', 3, 3, getdate());
INSERT INTO CustomerOrder(Id, CustomerName, InventoryId, Quantity, Created) VALUES (4, 'Claire Smith', 1, 1, getdate());
INSERT INTO CustomerOrder(Id, CustomerName, InventoryId, Quantity, Created) VALUES (5, 'Sarah Fedun', 4, 3, getdate());
INSERT INTO CustomerOrder(Id, CustomerName, InventoryId, Quantity, Created) VALUES (6, 'Graham Hinson', 3, 9, getdate());
