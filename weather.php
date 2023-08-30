<?php
header('Content-Type: text/html; charset=utf-8');
$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = '';
$dbName = 'weather'; 

// Establish a database connection
$connection = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if ($connection->connect_error) {
    die('Connection failed: ' . $connection->connect_error);
}

// Query to fetch data
$query = "SELECT * FROM weather_data"; 
$result = mysqli_query($connection, $query);

// Prepare an array to hold the data
$data = array();


$connection->set_charset("utf8");

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

$connection->close();

header('Content-Type: application/json');

echo json_encode($data);
?>
