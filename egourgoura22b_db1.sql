-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: May 21, 2025 at 10:18 AM
-- Server version: 11.7.2-MariaDB-ubu2404
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `egourgoura22b_db1`
--

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL,
  `reservation_uuid` char(36) NOT NULL DEFAULT uuid(),
  `user_id` int(11) NOT NULL,
  `restaurant_id` int(11) NOT NULL,
  `reservation_datetime` datetime NOT NULL,
  `guests` int(11) NOT NULL DEFAULT 1,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`reservation_id`, `reservation_uuid`, `user_id`, `restaurant_id`, `reservation_datetime`, `guests`, `status`, `created_at`) VALUES
(1, 'a288267f-3622-11f0-b9d0-3681c1edf024', 1, 2, '2025-06-01 19:00:00', 2, 'confirmed', '2025-05-21 09:04:43'),
(2, 'a2884cfa-3622-11f0-b9d0-3681c1edf024', 1, 4, '2025-06-03 20:30:00', 3, 'pending', '2025-05-21 09:04:43'),
(3, 'a2884e78-3622-11f0-b9d0-3681c1edf024', 1, 9, '2025-06-05 21:00:00', 4, 'cancelled', '2025-05-21 09:04:43'),
(4, '271da5fe-8f70-4d9f-9a6f-5e5f491fa9a5', 1, 8, '2025-05-22 14:15:00', 5, 'pending', '2025-05-21 09:55:21'),
(5, '6d43cfd9-3494-42d0-a9ec-c8eebc895aa4', 1, 14, '2025-05-21 10:14:00', 2, 'pending', '2025-05-21 10:14:44'),
(6, '27180e94-9305-47cc-8b1d-87976a40de1a', 1, 14, '2025-05-22 14:35:00', 8, 'pending', '2025-05-21 10:17:24');

-- --------------------------------------------------------

--
-- Table structure for table `restaurants`
--

CREATE TABLE `restaurants` (
  `restaurant_id` int(11) NOT NULL,
  `restaurant_uuid` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `restaurants`
--

INSERT INTO `restaurants` (`restaurant_id`, `restaurant_uuid`, `name`, `address`, `phone`, `created_at`) VALUES
(1, '7942e1dd-16ed-11f0-978b-76eaf385044d', 'The Fancy Fork', '123 Main St', '555-1010', '2025-04-11 15:56:04'),
(2, '7942e3e7-16ed-11f0-978b-76eaf385044d', 'Pizza Palace', '45 Market Road', '555-2020', '2025-04-11 15:56:04'),
(3, '7942e490-16ed-11f0-978b-76eaf385044d', 'Sushi World', '99 Ocean Ave', '555-3030', '2025-04-11 15:56:04'),
(4, '7942e518-16ed-11f0-978b-76eaf385044d', 'Burger Barn', '77 Sunset Blvd', '555-4040', '2025-04-11 15:56:04'),
(5, '7942e59c-16ed-11f0-978b-76eaf385044d', 'El Taco Town', '210 Fiesta Ln', '555-5050', '2025-04-11 15:56:04'),
(6, '7942e602-16ed-11f0-978b-76eaf385044d', 'Pasta Paradise', '12 Noodle St', '555-6060', '2025-04-11 15:56:04'),
(7, '7942e64d-16ed-11f0-978b-76eaf385044d', 'Curry House', '56 Spice Rd', '555-7070', '2025-04-11 15:56:04'),
(8, '7942e691-16ed-11f0-978b-76eaf385044d', 'BBQ Haven', '88 Smoky Way', '555-8080', '2025-04-11 15:56:04'),
(9, '7942e6d7-16ed-11f0-978b-76eaf385044d', 'Garden Greens', '102 Healthy Ave', '555-9090', '2025-04-11 15:56:04'),
(10, '7942e718-16ed-11f0-978b-76eaf385044d', 'Steak & Co.', '350 Rare Dr', '555-1111', '2025-04-11 15:56:04'),
(11, '7942e756-16ed-11f0-978b-76eaf385044d', 'Seafood Central', '171 Coastline Pl', '555-2222', '2025-04-11 15:56:04'),
(12, '7942e794-16ed-11f0-978b-76eaf385044d', 'Dimsum Delight', '66 Dragon St', '555-3333', '2025-04-11 15:56:04'),
(13, '7942e7d6-16ed-11f0-978b-76eaf385044d', 'Vegan Vibes', '500 Leaf Ln', '555-4444', '2025-04-11 15:56:04'),
(14, '7942e816-16ed-11f0-978b-76eaf385044d', 'Mediterranean Magic', '31 Olive Pkwy', '555-5555', '2025-04-11 15:56:04'),
(15, '7942e854-16ed-11f0-978b-76eaf385044d', 'Brunch & Brew', '808 Coffee Dr', '555-6666', '2025-04-11 15:56:04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_uuid` char(36) NOT NULL DEFAULT uuid(),
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_uuid`, `username`, `email`, `password`, `created_at`) VALUES
-- Password: test1234                                                                                                
(1, 'a283089a-3622-11f0-b9d0-3681c1edf024', 'egourgoura22b', 'egourgoura22b@test.com', '$2b$10$DpvP7cbYNvmSSa5mkl0VcOvTpc0n3nRowbv5gZDTnd7iXPlDA07I2', '2025-05-21 09:04:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD UNIQUE KEY `reservation_uuid` (`reservation_uuid`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `restaurant_id` (`restaurant_id`);

--
-- Indexes for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`restaurant_id`),
  ADD UNIQUE KEY `restaurant_uuid` (`restaurant_uuid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `user_uuid` (`user_uuid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `restaurant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
