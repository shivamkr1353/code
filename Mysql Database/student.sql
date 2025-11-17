-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 17, 2025 at 11:05 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `placement`
--

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `sid` int(11) NOT NULL COMMENT 'Auto increment',
  `sname` varchar(50) NOT NULL,
  `semail` varchar(50) NOT NULL,
  `spass` varchar(500) NOT NULL,
  `collegename` varchar(50) NOT NULL,
  `age` decimal(3,0) NOT NULL,
  `city` varchar(50) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `smobileno` decimal(10,0) NOT NULL,
  `isverified` varchar(50) NOT NULL DEFAULT 'NO',
  `dname` varchar(50) NOT NULL,
  `passingyear` varchar(10) NOT NULL,
  `result10` varchar(10) NOT NULL,
  `result12` varchar(10) NOT NULL,
  `avgcgpa` varchar(10) NOT NULL,
  `backlogs` decimal(3,0) NOT NULL,
  `resume_url` varchar(255) DEFAULT NULL,
  `is_placed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`sid`, `sname`, `semail`, `spass`, `collegename`, `age`, `city`, `gender`, `smobileno`, `isverified`, `dname`, `passingyear`, `result10`, `result12`, `avgcgpa`, `backlogs`, `resume_url`, `is_placed`) VALUES
(39, 'adarsh', 'adarsh@gmail.com', '$2a$12$.1eGhO1/bImq2TQgW6aYo.kxBZVXsh19OZeLFT3.pOkIFUcNGmbsi', 'ddu', 20, 'surat', 'male', 2147483647, 'NO', 'computer', '2022', '85', '90', '8.67', 1, NULL, 0),
(200, 'anjan', 'anjan@gmail.com', '$2a$12$Pg0ZzX6XZHkagJL75HUTSOTvL8RKBmQLgE4V3cbiMkKv9mV4sMGlq', 'tpocollege', 20, 'Jamnagar', 'male', 2147483647, 'NO', 'Civil', '2023', '94', '90', '9.08', 0, NULL, 0),
(207, 'charmi Mehta', 'charmi@gmail.com', '$2a$12$122M1XJmR.CAa8zrXEwu2OB3cBJhOVZFPfc55Gnpcdz1mrJNizBh.', 'ddu', 21, 'dwarka', 'female', 2147483647, 'YES', 'Computer', '2022', '91', '85', '8.5', 0, NULL, 0),
(208, 'jay sanghani', 'jay@gmail.com', '$2a$12$GWWzfVGfK52ZJ.xZQa.vLu03dczV.ZPa1Ntx6hZiETR9xkD0pxMKq', 'ddu', 21, 'surat', 'male', 2147483647, 'YES', 'MBA', '2021', '70', '75', '7.9', 2, NULL, 0),
(209, 'kailash', 'kailash@gmail.com', '$2a$12$GR8g7QKL29BVBDHIOdeC2eRtst7wypSGBz9BBb3dQ.UBGdkIp0KOS', 'ddu', 20, 'nadiad', 'male', 2147483647, 'YES', 'MCA', '2022', '85', '70', '8.3', 1, NULL, 0),
(210, 'dip Vachhani', 'dip@gmail.com', '$2a$12$moQY.KzFhGyYF49rM3ZNKepLl/cYtoSHKdRxkdBgIBPkT3ebx6RdO', 'ddu', 18, 'jamnagar', 'male', 2147483647, 'YES', 'Computer', '2021', '80', '95', '9', 0, NULL, 0),
(211, 'shyam', 'shaym@gmail.com', '$2a$12$8dxy/dYpk94LBKaoapBBQOTAssbhJ3z.J5PgUtrEU2A7E8LLisDF.', 'ddu', 20, 'surat', 'male', 2147483647, 'YES', 'It', '2021', '92', '95', '7.77', 0, NULL, 0),
(212, 'drashty patel', 'drashty@gmail.com', '$2a$12$q33tcFQm4EzKZchI7CBnLOafDrIdpD2UqHQPXa72kJD3sVj71qo9i', 'ddu', 21, 'jamnagar', 'female', 2147483647, 'YES', 'Chemical', '2022', '90', '90', '9', 0, NULL, 0),
(213, 'kd', 'kd@gmail.com', '$2a$12$Ba78di7cHQED47LNm4GBxuVpsJ4U6QPiGrUkODXvasgicpxBDcAJu', 'nirma', 20, 'Jamnangar', 'male', 0, 'NO', 'Chemical', '2023', '80', '80', '8.5', 0, NULL, 0),
(254, 'Darshak Kathiriya', 'darshak@gmail.com', '$2a$12$OU/.rQC1xpIsuQUclL3t.uiGPqtZfwmcn7LyXR81YRsU8V4aoz0eG', 'tpocollege', 18, 'jamnagar', 'male', 9988776655, 'YES', 'It', '2021', '90', '95', '8', 0, NULL, 0),
(255, 'ramesh sanghani', 'ramesh@gmail.com', '$2a$12$q5yDzxDDzt8dlwCW4BztCudU98YGfbiizKHveloi1KqiXkSibkhky', 'tpocollege', 20, 'surat', 'male', 2147483647, 'YES', 'MBA', '2021', '70', '75', '7.9', 1, NULL, 0),
(256, 'mahesh', 'mahesh@gmail.com', '$2a$12$ShnXjXMgekd2aIp9.F/qa.0lM/3oQxv0XzwdOp6doMKGVNc3C6OFy', 'tpocollege', 20, 'nadiad', 'male', 2147483647, 'YES', 'Computer', '2022', '85', '70', '8.3', 2, NULL, 0),
(257, 'ayushi ajudiya', 'ayushi@gmail.com', '$2a$12$1nNV0kKxxSzF8DlK8zUP2O3LFoPYjvzkU5aPBZqbKKGmFfiLYGhHm', 'tpocollege', 19, 'jamnagar', 'female', 2147483647, 'YES', 'Chemical', '2022', '90', '90', '9', 0, NULL, 0),
(258, 'Nihal Limbani', 'nihal@gmail.com', '$2a$12$G.bxGyl/iOcO8ALLHuo3ZOwsOFpiPT2ftUdi/bu3jl056OjQww0ka', 'tpocollege', 19, 'dwarka', 'male', 2147483647, 'YES', 'Computer', '2022', '91', '85', '8.5', 0, NULL, 0),
(259, 'suresh', 'suresh@gmail.com', '$2a$12$U38VJAd2zXSXdvBT.3wH8OPRAK0.bbwt58iSImpXWH0Aq0Y6C.Vdq', 'tpocollege', 20, 'surat', 'male', 2147483647, 'YES', 'It', '2021', '92', '95', '7.77', 0, NULL, 0),
(372, 'shivam kr', 'shivamkr997386@gmail.com', '$2a$12$i3Jofnxy0pqM9lF7v6b2vefttEnvbHV9smBGOQy1Lxl2F9dNNpZO6', 'tpocollege', 20, 'Ranchi', 'Male', 9999999999, '0', 'COMPUTER', '2027', '90', '90', '9.6', 0, 'https://nexus-resumes.s3.eu-north-1.amazonaws.com/1763163638058-SATHACK.pdf', 0),
(373, 'Raushan Kumar', 'raushan@gmail.com', '$2a$12$3qFdwdQSVfjZlUupzdb6/O4GPvPSeWs9eBoSrLx1TxmAFHKTlNgZ.', 'TIET', 0, '', '', 0, '0', '', '', '', '', '', 0, NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`sid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Auto increment', AUTO_INCREMENT=374;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
