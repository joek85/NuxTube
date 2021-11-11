-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 11, 2021 at 01:33 PM
-- Server version: 8.0.27-0ubuntu0.20.04.1
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nuxtube`
--

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` bigint NOT NULL,
  `videoId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `author_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `author_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `author_thumbnail` longtext,
  `thumbnail` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `duration` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `views` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `published` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `date` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
