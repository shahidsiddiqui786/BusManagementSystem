### database name  :- busmanagement

# Tables 

## bus
<pre>
  CREATE TABLE `bus` (
  `idbus` int NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `idconductor` int NOT NULL,
  `capacity` int NOT NULL,
  `reserved` int NOT NULL,
  `from` varchar(45) NOT NULL,
  `to` varchar(45) NOT NULL,
  PRIMARY KEY (`idbus`),
  UNIQUE KEY `busno_UNIQUE` (`name`),
  KEY `idconductor_idx` (`idconductor`),
  CONSTRAINT `idconductor` FOREIGN KEY (`idconductor`) REFERENCES `conductor` (`idconductor`)
)
</pre>

## conductor
<pre>
 CREATE TABLE `conductor` (
  `idconductor` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `iddriver` int NOT NULL,
  PRIMARY KEY (`idconductor`),
  KEY `iddriver_idx` (`iddriver`),
  CONSTRAINT `iddriver` FOREIGN KEY (`iddriver`) REFERENCES `driver` (`iddriver`)
) 
</pre>

## driver
<pre>
  CREATE TABLE `driver` (
  `iddriver` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`iddriver`)
)
</pre>

## passanger
<pre>
 CREATE TABLE `passanger` (
  `idpassanger` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`idpassanger`)
) 
</pre>

## transact
<pre>
 CREATE TABLE `transact` (
  `idtransact` int NOT NULL AUTO_INCREMENT,
  `tid` varchar(45) NOT NULL,
  `pid` int NOT NULL,
  `idbus` int NOT NULL,
  `ticket` int NOT NULL,
  `time` longtext NOT NULL,
  PRIMARY KEY (`idtransact`),
  UNIQUE KEY `idTransact_UNIQUE` (`idtransact`),
  KEY `idbus_idx` (`idbus`),
  KEY `pid_idx` (`pid`),
  CONSTRAINT `idbus1` FOREIGN KEY (`idbus`) REFERENCES `bus` (`idbus`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `pid` FOREIGN KEY (`pid`) REFERENCES `passanger` (`idpassanger`) ON DELETE RESTRICT ON UPDATE RESTRICT
) 
</pre>
