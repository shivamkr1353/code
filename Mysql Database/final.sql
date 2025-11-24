-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2025 at 02:21 PM
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
CREATE DATABASE IF NOT EXISTS `placement` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `placement`;

-- --------------------------------------------------------

--
-- Table structure for table `applied`
--

DROP TABLE IF EXISTS `applied`;
CREATE TABLE `applied` (
  `aid` int(11),
  `jid` int(11),
  `cid` int(11),
  `sid` int(11),
  `iseligible` varchar(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applied`
--

INSERT INTO `applied` (`aid`, `jid`, `cid`, `sid`, `iseligible`) VALUES
(89, 101, 5, 210, 'yes'),
(90, 101, 5, 211, 'no'),
(91, 99, 5, 210, 'yes'),
(92, 99, 5, 207, 'no'),
(93, 105, 5, 254, 'yes'),
(94, 104, 5, 254, 'yes'),
(95, 108, 7, 254, 'no'),
(98, 111, 5, 254, 'yes'),
(99, 113, 20, 372, 'yes'),
(100, 115, 20, 372, 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `cid` int(11) COMMENT 'Auto increment',
  `hrname` varchar(50),
  `cemail` varchar(50),
  `cpassword` varchar(500),
  `cname` char(50),
  `cwebsite` varchar(50),
  `city` varchar(100),
  `ctype` varchar(50),
  `cinfo` varchar(100),
  `cmobileno` decimal(10,0),
  `empl` varchar(50)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`cid`, `hrname`, `cemail`, `cpassword`, `cname`, `cwebsite`, `city`, `ctype`, `cinfo`, `cmobileno`, `empl`) VALUES
(5, 'hr', 'tcs@gmail.com', '$2a$12$7KNAgxGZsJGtUNMsN81C1euU8LNLdjlRbxHIzK2qU6UMe8mM3JEQ2', 'tcs', 'www.tcs.com', 'Pune', 'Public Limited Company', 'IT Company ', 9913919327, '200 to 499'),
(7, 'shayambhai', 'easytech@gmail.com', '$2a$12$fSsZp3nnfzCUxHyLbUSsLOCZJ6Pv3nLx6P7lKu1wAp2h0EX4x0ixO', 'easytech', 'www.easytech.in', 'delhi', 'other', 'goverment Contract Company', 6549873211, 'more than 1000'),
(10, 'mohitbhai', 'jio@gmail.com', '$2a$12$iiF.p8wNF7YOabxtpqc9ZeIV9CIdWk.iKXWHnLo./8DLhv2guXi3S', 'jio', 'www.jio.com', 'Ahmedabad', 'Joint-Venture Company', '', 9999999999, '200 to 499'),
(12, 'vipulbhai', 'vivo@gmail.com', '$2a$12$8Al9Tdw4ZhWHFFfpPb8.te76qfXetMKEUhR.Il8oysShhsLlisuYm', 'vivo', 'www.vivo.com', 'Nadiad', 'One Person Company', 'Software Company', 6665554444, 'less than 200'),
(13, 'princebhai', 'oppo@gmail.com', '$2a$12$QSff.ebbe0ybyfX4YUcZAegvoTsv4MeEGuRdYN/ic.bRVD8RF1nzi', 'oppo', 'www.oppo.in', 'mumbai', 'Private Limited Company', 'agritech', 9876665555, '500 to 1000'),
(14, 'jenishbhai', 'info@gmail.com', '$2a$12$42tYQlITtBL9JmZchTYL9u.yTdWIMph3ngMCJcvOjdfAnlQdDjoQW', 'info', 'www.infotech.com', 'surat', 'Public Limited Company', 'IT Company ', 9999965432, 'more than 1000'),
(15, 'dhirajbhai', 'funtech@gmail.com', '$2a$12$xDlIH6sB3Fxg/jmxAlNxFO0HcuAL7349OIQxmzdJwQSXDyquDxmsa', 'funtech', 'www.funtech.org.in', 'rajkot', 'Non-Government Organization (NGO)', 'help in any innovation', 9876543222, '500 to 1000'),
(20, 'shivam kr', 'shivamkr997386@gmail.com', '$2a$12$HXBg7y08qVjDl0h/j9rULeB0nZdhtiNe3itA8krhQaSY01yrCo0me', 'PWC', 'www.pwcindia.com', 'Ranchi', 'IT', 'Counsulting', 9876543215, '88888'),
(21, 'Aniket Singh', 'aniket@gmail.com', '$2a$12$jUTajtNioT263mQjlXAYOOEKef4ZuBLTptdTbrsU7xdtvhd60YYPi', 'Delloite', '', '', '', '', 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `jobdetail`
--

DROP TABLE IF EXISTS `jobdetail`;
CREATE TABLE `jobdetail` (
  `jid` int(11),
  `cid` int(11) COMMENT 'Foreign key',
  `place` varchar(50),
  `salary` varchar(50),
  `bondyears` decimal(10,0),
  `servagree` varchar(500),
  `jobtype` varchar(50),
  `jobinfo` varchar(500),
  `vacancy` decimal(10,0),
  `minavgcp` float,
  `minblog` int(11),
  `lastdate` varchar(50),
  `dateexam` varchar(50),
  `dateinterview` varchar(50),
  `college` varchar(100),
  `department` varchar(100),
  `request` varchar(10) DEFAULT 'no',
  `accepted` varchar(10) DEFAULT 'no',
  `rejected` varchar(10) DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `jobdetail`
--

INSERT INTO `jobdetail` (`jid`, `cid`, `place`, `salary`, `bondyears`, `servagree`, `jobtype`, `jobinfo`, `vacancy`, `minavgcp`, `minblog`, `lastdate`, `dateexam`, `dateinterview`, `college`, `department`, `request`, `accepted`, `rejected`) VALUES
(101, 5, 'Surat', '15000/month', 1, '', 'Job', '', 20, 8, 0, '2021-04-03', '2021-04-07', '2021-04-09', 'all', 'COMPUTER,IT', 'no', 'no', 'no'),
(102, 5, 'Ahemdabaad', '20000/month', 0, '', 'Job', '', 25, 8, 0, '2021-04-08', '', '', 'tpocollege', 'COMPUTER,MCA', 'no', 'no', 'no'),
(103, 5, 'Ahemdabaad', '5000/month', 0, '', 'Only Internship', '', 20, 7, 0, '', '', '', 'ddu', 'IT', 'yes', 'no', 'no'),
(104, 5, 'Ahemdabaad', '20000/month', 0, 'some job serv agreement are there', 'Job', 'Field Eng', 35, 8.6, 0, '2021-04-06', '2021-04-01', '2021-04-04', 'tpocollege', 'COMPUTER,MBA', 'no', 'no', 'no'),
(105, 5, 'Nadiad', '50000/month', 0, '', 'Internship + Job', '', 35, 8, 0, '2021-04-07', '2021-04-08', '2021-04-10', 'tpocollege', 'COMPUTER,IT', 'yes', 'yes', 'no'),
(106, 5, 'Bangalore', '25000/month', 1, '', 'Job', '', 36, 8, 0, '2025-12-31', '2026-01-02', '2026-02-11', 'tpocollege', 'MBA,IT', 'yes', 'yes', 'no'),
(107, 7, 'Ahemdabaad', '20000/month', 1, '', 'Internship + Job', '', 25, 8, 0, '', '', '', 'tpocollege', 'COMPUTER', 'yes', 'no', 'yes'),
(108, 7, 'Pune', '50000/month', 0, '', 'Internship + Job', '', 15, 9.1, 0, '2021-04-20', '2021-04-22', '2021-04-24', 'all', 'IT', 'no', 'no', 'no'),
(111, 5, 'Ahemdabaad', '50000/month', 0, '', 'Internship + Job', '', 50, 8, 0, '2021-05-12', '', '', 'all', 'COMPUTER', 'no', 'no', 'no'),
(112, 5, 'Ahemdabaad', '20000/month', 0, '', 'Internship + Job', '', 20, 0, 0, '2021-05-12', '', '', 'tpocollege', 'COMPUTER,IT', 'yes', 'yes', 'no'),
(113, 20, 'Ranchi', '10000', 3, 'yes', 'Internship + Job', 'Full Stack Developer', 22, 7.5, 0, '2025-12-31', '2026-01-01', '2026-01-15', 'all', 'COMPUTER, CIVIL, MBA, MCA, IT, CHEMICAL, CSE', 'no', 'no', 'no'),
(115, 20, 'Ranchi', '123000', 2, 'ys', 'Only Internship', 'ai/ml', 44, 7.5, 1, '2025-10-24', '2025-10-25', '2025-10-31', 'tpocollege', 'COMPUTER,MCA,IT', 'yes', 'yes', 'no'),
(116, 21, 'Gurugram', '10000000', 0, '', 'Internship + Job', 'Backend Developer', 30, 6, 0, '2025-12-06', '2026-01-14', '2026-01-31', 'BIT MESRA', 'COMPUTER,CIVIL,MBA,MCA,IT,CHEMICAL,MECHANICAL,CE,ELECTRICAL', 'yes', 'yes', 'no');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `sid` int(11) COMMENT 'Auto increment',
  `sname` varchar(50),
  `semail` varchar(50),
  `spass` varchar(500),
  `collegename` varchar(50),
  `age` decimal(3,0),
  `city` varchar(50) DEFAULT '',
  `gender` varchar(50),
  `smobileno` decimal(10,0),
  `isverified` varchar(50) DEFAULT 'NO',
  `dname` varchar(50),
  `passingyear` varchar(10),
  `result10` varchar(10),
  `result12` varchar(10),
  `avgcgpa` varchar(10),
  `backlogs` decimal(3,0),
  `resume_url` varchar(255) DEFAULT NULL,
  `is_placed` tinyint(1) DEFAULT 0
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
(372, 'shivam kr', 'shivamkr997386@gmail.com', '$2a$12$i3Jofnxy0pqM9lF7v6b2vefttEnvbHV9smBGOQy1Lxl2F9dNNpZO6', 'tpocollege', 20, 'Ranchi', 'Male', 9999999999, '0', 'COMPUTER', '2027', '90', '90', '9.6', 0, 'https://nexus-resumes.s3.eu-north-1.amazonaws.com/1763585603053-15.%20Network%20Layer%20%26%20Subnetting.pdf', 0),
(374, 'a', 'adarsh@gmail.com', '$2a$12$.1eGh...', 'ddu', 20, 'surat', 'male', 2147483647, 'NO', 'computer', '2022', '85', '90', '8.67', 1, NULL, 0),
(375, 's', 'anjan@gmail.com', '$2a$12$Pg0Zz...', 'tpocollege', 20, 'Jamnagar', 'male', 2147483647, 'NO', 'Civil', '2023', '94', '90', '9.08', 0, NULL, 0),
(376, 'cd', 'charmi@gmail.com', '$2a$12$122M1...', 'ddu', 21, 'dwarka', 'female', 2147483647, 'YES', 'Computer', '2022', '91', '85', '8.5', 0, NULL, 0),
(377, 'sdd', 'rahul123@gmail.com', '$2a$12$ABCD1...', 'BIT MESRA', 22, 'ahmedabad', 'male', 9876543210, 'NO', 'IT', '2023', '88', '87', '8.75', 0, NULL, 0),
(378, 'dfs', 'neha.p@gmail.com', '$2a$12$XYZK2...', 'BIT MESRA', 21, 'vadodara', 'female', 9123456780, 'YES', 'Computer', '2022', '92', '89', '9.2', 0, NULL, 0),
(379, 'sdd', 'vivek09@gmail.com', '$2a$12$TT55A...', 'ddu', 23, 'surat', 'male', 9012345678, 'NO', 'Mechanical', '2021', '75', '70', '7.1', 2, NULL, 0),
(380, 'fd', 'riddhi@gmail.com', '$2a$12$88HJJ...', 'nirma', 20, 'ahmedabad', 'female', 9988776655, 'YES', 'CE', '2023', '95', '93', '9.5', 0, NULL, 1),
(381, 'fdefe', 'sanjayk@gmail.com', '$2a$12$PPQ11...', 'BIT MESRA', 22, 'rajkot', 'male', 8877665544, 'NO', 'Electrical', '2022', '80', '78', '8.1', 1, NULL, 0),
(382, 'ccd', 'mahima_22@gmail.com', '$2a$12$LLKK7...', 'ddu', 21, 'jamnagar', 'female', 7766554433, 'YES', 'Computer', '2023', '90', '88', '9', 0, NULL, 0),
(383, 'ssds', 'yash12@gmail.com', '$2a$12$4455B...', 'tpocollege', 22, 'surat', 'male', 9988001122, 'NO', 'IT', '2024', '89', '85', '8.8', 0, NULL, 1),
(384, 'a', 'adarsh@gmail.com', '$2a$12$.1eGh...', 'ddu', 20, 'surat', 'male', 2147483647, 'NO', 'computer', '2022', '85', '90', '8.67', 1, NULL, 0),
(385, 's', 'anjan@gmail.com', '$2a$12$Pg0Zz...', 'tpocollege', 20, 'Jamnagar', 'male', 2147483647, 'NO', 'Civil', '2023', '94', '90', '9.08', 0, NULL, 0),
(386, 'cd', 'charmi@gmail.com', '$2a$12$122M1...', 'ddu', 21, 'dwarka', 'female', 2147483647, 'YES', 'Computer', '2022', '91', '85', '8.5', 0, NULL, 0),
(387, 'sdd', 'rahul123@gmail.com', '$2a$12$ABCD1...', 'gtu', 22, 'ahmedabad', 'male', 9876543210, 'NO', 'IT', '2023', '88', '87', '8.75', 0, NULL, 0),
(388, 'dfs', 'neha.p@gmail.com', '$2a$12$XYZK2...', 'msu', 21, 'vadodara', 'female', 9123456780, 'YES', 'Computer', '2022', '92', '89', '9.2', 0, NULL, 1),
(389, 'sdd', 'vivek09@gmail.com', '$2a$12$TT55A...', 'ddu', 23, 'surat', 'male', 9012345678, 'NO', 'Mechanical', '2021', '75', '70', '7.1', 2, NULL, 0),
(390, 'fd', 'riddhi@gmail.com', '$2a$12$88HJJ...', 'nirma', 20, 'ahmedabad', 'female', 9988776655, 'YES', 'CE', '2023', '95', '93', '9.5', 0, NULL, 1),
(391, 'fdefe', 'sanjayk@gmail.com', '$2a$12$PPQ11...', 'gtu', 22, 'rajkot', 'male', 8877665544, 'NO', 'Electrical', '2022', '80', '78', '8.1', 1, NULL, 0),
(392, 'ccd', 'mahima_22@gmail.com', '$2a$12$LLKK7...', 'ddu', 21, 'jamnagar', 'female', 7766554433, 'YES', 'Computer', '2023', '90', '88', '9', 0, NULL, 0),
(393, 'ssds', 'yash12@gmail.com', '$2a$12$4455B...', 'tpocollege', 22, 'surat', 'male', 9988001122, 'NO', 'IT', '2024', '89', '85', '8.8', 0, NULL, 0),
(394, 'a', 'adarsh@gmail.com', '$2a$12$.1eGh...', 'ddu', 20, 'surat', 'male', 2147483647, 'NO', 'computer', '2022', '85', '90', '8.67', 1, NULL, 0),
(395, 's', 'anjan@gmail.com', '$2a$12$Pg0Zz...', 'tpocollege', 20, 'Jamnagar', 'male', 2147483647, 'NO', 'Civil', '2023', '94', '90', '9.08', 0, NULL, 0),
(396, 'cd', 'charmi@gmail.com', '$2a$12$122M1...', 'ddu', 21, 'dwarka', 'female', 2147483647, 'YES', 'Computer', '2022', '91', '85', '8.5', 0, NULL, 0),
(397, 'sdd', 'rahul123@gmail.com', '$2a$12$ABCD1...', 'gtu', 22, 'ahmedabad', 'male', 9876543210, 'NO', 'IT', '2023', '88', '87', '8.75', 0, NULL, 0),
(398, 'dfs', 'neha.p@gmail.com', '$2a$12$XYZK2...', 'msu', 21, 'vadodara', 'female', 9123456780, 'YES', 'Computer', '2022', '92', '89', '9.2', 0, NULL, 1),
(399, 'sdd', 'vivek09@gmail.com', '$2a$12$TT55A...', 'ddu', 23, 'surat', 'male', 9012345678, 'NO', 'Mechanical', '2021', '75', '70', '7.1', 2, NULL, 0),
(400, 'fd', 'riddhi@gmail.com', '$2a$12$88HJJ...', 'nirma', 20, 'ahmedabad', 'female', 9988776655, 'YES', 'CE', '2023', '95', '93', '9.5', 0, NULL, 1),
(401, 'fdefe', 'sanjayk@gmail.com', '$2a$12$PPQ11...', 'gtu', 22, 'rajkot', 'male', 8877665544, 'NO', 'Electrical', '2022', '80', '78', '8.1', 1, NULL, 0),
(402, 'ccd', 'mahima_22@gmail.com', '$2a$12$LLKK7...', 'ddu', 21, 'jamnagar', 'female', 7766554433, 'YES', 'Computer', '2023', '90', '88', '9', 0, NULL, 0),
(403, 'ssds', 'yash12@gmail.com', '$2a$12$4455B...', 'tpocollege', 22, 'surat', 'male', 9988001122, 'NO', 'IT', '2024', '89', '85', '8.8', 0, NULL, 0),
(404, 'a', 'adarsh@gmail.com', '$2a$12$.1eGh...', 'ddu', 20, 'surat', 'male', 2147483647, 'NO', 'computer', '2022', '85', '90', '8.67', 1, NULL, 0),
(405, 's', 'anjan@gmail.com', '$2a$12$Pg0Zz...', 'tpocollege', 20, 'Jamnagar', 'male', 2147483647, 'NO', 'Civil', '2023', '94', '90', '9.08', 0, NULL, 0),
(406, 'cd', 'charmi@gmail.com', '$2a$12$122M1...', 'ddu', 21, 'dwarka', 'female', 2147483647, 'YES', 'Computer', '2022', '91', '85', '8.5', 0, NULL, 0),
(407, 'sdd', 'rahul123@gmail.com', '$2a$12$ABCD1...', 'gtu', 22, 'ahmedabad', 'male', 9876543210, 'NO', 'IT', '2023', '88', '87', '8.75', 0, NULL, 0),
(408, 'dfs', 'neha.p@gmail.com', '$2a$12$XYZK2...', 'msu', 21, 'vadodara', 'female', 9123456780, 'YES', 'Computer', '2022', '92', '89', '9.2', 0, NULL, 1),
(409, 'sdd', 'vivek09@gmail.com', '$2a$12$TT55A...', 'ddu', 23, 'surat', 'male', 9012345678, 'NO', 'Mechanical', '2021', '75', '70', '7.1', 2, NULL, 0),
(410, 'fd', 'riddhi@gmail.com', '$2a$12$88HJJ...', 'nirma', 20, 'ahmedabad', 'female', 9988776655, 'YES', 'CE', '2023', '95', '93', '9.5', 0, NULL, 1),
(411, 'fdefe', 'sanjayk@gmail.com', '$2a$12$PPQ11...', 'gtu', 22, 'rajkot', 'male', 8877665544, 'NO', 'Electrical', '2022', '80', '78', '8.1', 1, NULL, 0),
(412, 'ccd', 'mahima_22@gmail.com', '$2a$12$LLKK7...', 'ddu', 21, 'jamnagar', 'female', 7766554433, 'YES', 'Computer', '2023', '90', '88', '9', 0, NULL, 0),
(413, 'ssds', 'yash12@gmail.com', '$2a$12$4455B...', 'tpocollege', 22, 'surat', 'male', 9988001122, 'NO', 'IT', '2024', '89', '85', '8.8', 0, NULL, 0),
(414, 'a', 'adarsh@gmail.com', '$2a$12$.1eGh...', 'ddu', 20, 'surat', 'male', 2147483647, 'NO', 'computer', '2022', '85', '90', '8.67', 1, NULL, 0),
(415, 's', 'anjan@gmail.com', '$2a$12$Pg0Zz...', 'tpocollege', 20, 'Jamnagar', 'male', 2147483647, 'NO', 'Civil', '2023', '94', '90', '9.08', 0, NULL, 0),
(416, 'cd', 'charmi@gmail.com', '$2a$12$122M1...', 'ddu', 21, 'dwarka', 'female', 2147483647, 'YES', 'Computer', '2022', '91', '85', '8.5', 0, NULL, 0),
(417, 'sdd', 'rahul123@gmail.com', '$2a$12$ABCD1...', 'gtu', 22, 'ahmedabad', 'male', 9876543210, 'NO', 'IT', '2023', '88', '87', '8.75', 0, NULL, 0),
(418, 'dfs', 'neha.p@gmail.com', '$2a$12$XYZK2...', 'msu', 21, 'vadodara', 'female', 9123456780, 'YES', 'Computer', '2022', '92', '89', '9.2', 0, NULL, 1),
(419, 'sdd', 'vivek09@gmail.com', '$2a$12$TT55A...', 'ddu', 23, 'surat', 'male', 9012345678, 'NO', 'Mechanical', '2021', '75', '70', '7.1', 2, NULL, 0),
(420, 'fd', 'riddhi@gmail.com', '$2a$12$88HJJ...', 'nirma', 20, 'ahmedabad', 'female', 9988776655, 'YES', 'CE', '2023', '95', '93', '9.5', 0, NULL, 1),
(421, 'fdefe', 'sanjayk@gmail.com', '$2a$12$PPQ11...', 'gtu', 22, 'rajkot', 'male', 8877665544, 'NO', 'Electrical', '2022', '80', '78', '8.1', 1, NULL, 0),
(422, 'ccd', 'mahima_22@gmail.com', '$2a$12$LLKK7...', 'ddu', 21, 'jamnagar', 'female', 7766554433, 'YES', 'Computer', '2023', '90', '88', '9', 0, NULL, 0),
(423, 'ssds', 'yash12@gmail.com', '$2a$12$4455B...', 'tpocollege', 22, 'surat', 'male', 9988001122, 'NO', 'IT', '2024', '89', '85', '8.8', 0, NULL, 0),
(424, 'a', 'adarsh@gmail.com', '$2a$12$.1eGh...', 'ddu', 20, 'surat', 'male', 2147483647, 'NO', 'computer', '2022', '85', '90', '8.67', 1, NULL, 0),
(425, 's', 'anjan@gmail.com', '$2a$12$Pg0Zz...', 'tpocollege', 20, 'Jamnagar', 'male', 2147483647, 'NO', 'Civil', '2023', '94', '90', '9.08', 0, NULL, 0),
(426, 'cd', 'charmi@gmail.com', '$2a$12$122M1...', 'ddu', 21, 'dwarka', 'female', 2147483647, 'YES', 'Computer', '2022', '91', '85', '8.5', 0, NULL, 0),
(427, 'sdd', 'rahul123@gmail.com', '$2a$12$ABCD1...', 'gtu', 22, 'ahmedabad', 'male', 9876543210, 'NO', 'IT', '2023', '88', '87', '8.75', 0, NULL, 0),
(428, 'dfs', 'neha.p@gmail.com', '$2a$12$XYZK2...', 'msu', 21, 'vadodara', 'female', 9123456780, 'YES', 'Computer', '2022', '92', '89', '9.2', 0, NULL, 1),
(429, 'sdd', 'vivek09@gmail.com', '$2a$12$TT55A...', 'ddu', 23, 'surat', 'male', 9012345678, 'NO', 'Mechanical', '2021', '75', '70', '7.1', 2, NULL, 0),
(430, 'fd', 'riddhi@gmail.com', '$2a$12$88HJJ...', 'nirma', 20, 'ahmedabad', 'female', 9988776655, 'YES', 'CE', '2023', '95', '93', '9.5', 0, NULL, 1),
(431, 'fdefe', 'sanjayk@gmail.com', '$2a$12$PPQ11...', 'gtu', 22, 'rajkot', 'male', 8877665544, 'NO', 'Electrical', '2022', '80', '78', '8.1', 1, NULL, 0),
(432, 'ccd', 'mahima_22@gmail.com', '$2a$12$LLKK7...', 'ddu', 21, 'jamnagar', 'female', 7766554433, 'YES', 'Computer', '2023', '90', '88', '9', 0, NULL, 0),
(433, 'shudhanshu raj', 'yash12@gmail.com', '$2a$12$4455B...', 'tpocollege', 22, 'surat', 'male', 9988001122, 'NO', 'IT', '2024', '89', '85', '8.8', 0, NULL, 0),
(434, 'a', 'adarsh@gmail.com', '$2a$12$.1eGh...', 'ddu', 20, 'surat', 'male', 2147483647, 'NO', 'computer', '2022', '85', '90', '8.67', 1, NULL, 0),
(435, 's', 'anjan@gmail.com', '$2a$12$Pg0Zz...', 'tpocollege', 20, 'Jamnagar', 'male', 2147483647, 'NO', 'Civil', '2023', '94', '90', '9.08', 0, NULL, 0),
(436, 'cd', 'charmi@gmail.com', '$2a$12$122M1...', 'ddu', 21, 'dwarka', 'female', 2147483647, 'YES', 'Computer', '2022', '91', '85', '8.5', 0, NULL, 0),
(437, 'sdd', 'rahul123@gmail.com', '$2a$12$ABCD1...', 'gtu', 22, 'ahmedabad', 'male', 9876543210, 'NO', 'IT', '2023', '88', '87', '8.75', 0, NULL, 0),
(438, 'dfs', 'neha.p@gmail.com', '$2a$12$XYZK2...', 'msu', 21, 'vadodara', 'female', 9123456780, 'YES', 'Computer', '2022', '92', '89', '9.2', 0, NULL, 1),
(439, 'sdd', 'vivek09@gmail.com', '$2a$12$TT55A...', 'ddu', 23, 'surat', 'male', 9012345678, 'NO', 'Mechanical', '2021', '75', '70', '7.1', 2, NULL, 0),
(440, 'fd', 'riddhi@gmail.com', '$2a$12$88HJJ...', 'nirma', 20, 'ahmedabad', 'female', 9988776655, 'YES', 'CE', '2023', '95', '93', '9.5', 0, NULL, 1),
(441, 'fdefe', 'sanjayk@gmail.com', '$2a$12$PPQ11...', 'gtu', 22, 'rajkot', 'male', 8877665544, 'NO', 'Electrical', '2022', '80', '78', '8.1', 1, NULL, 0),
(442, 'ccd', 'mahima_22@gmail.com', '$2a$12$LLKK7...', 'ddu', 21, 'jamnagar', 'female', 7766554433, 'YES', 'Computer', '2023', '90', '88', '9', 0, NULL, 0),
(443, 'shudhanshu raj', 'yash12@gmail.com', '$2a$12$4455B...', 'tpocollege', 22, 'surat', 'male', 9988001122, 'NO', 'IT', '2024', '89', '85', '8.8', 0, NULL, 0),
(444, 'a', 'adarsh@gmail.com', '$2a$12$.1eGh...', 'ddu', 20, 'surat', 'male', 2147483647, 'NO', 'computer', '2022', '85', '90', '8.67', 1, NULL, 0),
(445, 's', 'anjan@gmail.com', '$2a$12$Pg0Zz...', 'tpocollege', 20, 'Jamnagar', 'male', 2147483647, 'NO', 'Civil', '2023', '94', '90', '9.08', 0, NULL, 0),
(446, 'cd', 'charmi@gmail.com', '$2a$12$122M1...', 'ddu', 21, 'dwarka', 'female', 2147483647, 'YES', 'Computer', '2022', '91', '85', '8.5', 0, NULL, 0),
(447, 'sdd', 'rahul123@gmail.com', '$2a$12$ABCD1...', 'gtu', 22, 'ahmedabad', 'male', 9876543210, 'NO', 'IT', '2023', '88', '87', '8.75', 0, NULL, 0),
(448, 'dfs', 'neha.p@gmail.com', '$2a$12$XYZK2...', 'msu', 21, 'vadodara', 'female', 9123456780, 'YES', 'Computer', '2022', '92', '89', '9.2', 0, NULL, 1),
(449, 'sdd', 'vivek09@gmail.com', '$2a$12$TT55A...', 'ddu', 23, 'surat', 'male', 9012345678, 'NO', 'Mechanical', '2021', '75', '70', '7.1', 2, NULL, 0),
(450, 'fd', 'riddhi@gmail.com', '$2a$12$88HJJ...', 'nirma', 20, 'ahmedabad', 'female', 9988776655, 'YES', 'CE', '2023', '95', '93', '9.5', 0, NULL, 1),
(451, 'fdefe', 'sanjayk@gmail.com', '$2a$12$PPQ11...', 'gtu', 22, 'rajkot', 'male', 8877665544, 'NO', 'Electrical', '2022', '80', '78', '8.1', 1, NULL, 0),
(452, 'ccd', 'mahima_22@gmail.com', '$2a$12$LLKK7...', 'ddu', 21, 'jamnagar', 'female', 7766554433, 'YES', 'Computer', '2023', '90', '88', '9', 0, NULL, 0),
(453, 'shudhanshu raj', 'yash12@gmail.com', '$2a$12$4455B...', 'tpocollege', 22, 'surat', 'male', 9988001122, 'NO', 'IT', '2024', '89', '85', '8.8', 0, NULL, 0),
(454, 'ashudhanshu', 'fh@gmail.com', 'djdj', 'ddu', 20, 'surat', 'male', 2147483647, 'NO', 'computer', '2022', '85', '90', '8.67', 1, NULL, 0),
(455, 'ashudhanshu', 'fh@gmail.com', 'djdj', 'ddu', 20, 'surat', 'male', 2147483647, 'NO', 'computer', '2022', '85', '90', '8.67', 1, NULL, 0),
(456, 'ashudhanshu', 'fh@gmail.com', 'djdj', 'ddu', 20, 'surat', 'male', 2147483647, 'NO', 'computer', '2022', '85', '90', '8.67', 1, NULL, 0),
(457, 'name0', 'name0@gmail.com', 'hash0', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(458, 'name1', 'name1@gmail.com', 'hash1', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(459, 'name2', 'name2@gmail.com', 'hash2', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(460, 'name3', 'name3@gmail.com', 'hash3', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(461, 'name4', 'name4@gmail.com', 'hash4', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(462, 'name5', 'name5@gmail.com', 'hash5', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(463, 'name6', 'name6@gmail.com', 'hash6', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(464, 'name7', 'name7@gmail.com', 'hash7', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(465, 'name8', 'name8@gmail.com', 'hash8', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(466, 'name9', 'name9@gmail.com', 'hash9', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(467, 'name0', 'name0@gmail.com', 'hash0', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(468, 'name1', 'name1@gmail.com', 'hash1', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(469, 'name2', 'name2@gmail.com', 'hash2', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(470, 'name3', 'name3@gmail.com', 'hash3', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(471, 'name4', 'name4@gmail.com', 'hash4', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(472, 'name5', 'name5@gmail.com', 'hash5', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(473, 'name6', 'name6@gmail.com', 'hash6', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(474, 'name7', 'name7@gmail.com', 'hash7', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(475, 'name8', 'name8@gmail.com', 'hash8', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(476, 'name9', 'name9@gmail.com', 'hash9', 'ddu', 20, 'surat', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(477, 'name0', 'name0@gmail.com', '123456789', 'BIT MESRA', 20, 'Ranchi', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(478, 'name1', 'name1@gmail.com', '123456789', 'BIT MESRA', 20, 'Ranchi', 'female', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(479, 'name2', 'name2@gmail.com', '123456789', 'BIT MESRA', 20, 'Ranchi', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(480, 'name3', 'name3@gmail.com', '123456789', 'BIT MESRA', 20, 'Ranchi', 'female', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(481, 'name4', 'name4@gmail.com', '123456789', 'BIT MESRA', 20, 'Ranchi', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(482, 'name5', 'name5@gmail.com', '123456789', 'BIT MESRA', 20, 'Ranchi', 'female', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(483, 'name6', 'name6@gmail.com', '123456789', 'BIT MESRA', 20, 'Ranchi', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(484, 'name7', 'name7@gmail.com', '123456789', 'BIT MESRA', 20, 'Ranchi', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(485, 'name8', 'name8@gmail.com', '123456789', 'BIT MESRA', 20, 'Ranchi', 'female', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(486, 'name9', 'name9@gmail.com', '123456789', 'BIT MESRA', 20, 'Ranchi', 'male', 9999999999, 'NO', 'Computer', '2022', '85', '90', '8.5', 0, NULL, 0),
(487, 'Pratik Gandhi', 'pratik@gmail.com', '$2a$12$i8PR3J71ifZ028KYD5gYxeVNo5kJdjff0bpAzZ19pSpu9IIt6rv0O', 'BIT MESRA', 0, '', '', 0, '0', '', '', '', '', '', 0, 'https://nexus-resumes.s3.eu-north-1.amazonaws.com/1763750957845-Assignment%2011.pdf', 0),
(488, 'Sunny Deol', 'sunny@gmail.com', '$2a$12$FJLRerxYuhl8x2BCXlMDf.ewn5aY5gxc7xJ4GQBLkfoFZzd6Qr8h2', 'tpocollege', 30, 'Ranchi', 'Male', 6556559, '0', 'IT', '2027', '92', '90', '8.8', 0, 'https://nexus-resumes.s3.eu-north-1.amazonaws.com/1763751813165-Ashish_Resume_final.pdf', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tpo`
--

DROP TABLE IF EXISTS `tpo`;
CREATE TABLE `tpo` (
  `tid` int(10) UNSIGNED,
  `tname` varchar(50),
  `temail` varchar(50),
  `tpassword` varchar(500),
  `collegename` varchar(50),
  `city` varchar(50),
  `mobileno` decimal(10,0),
  `website` varchar(50),
  `nirf` decimal(3,0),
  `nacc` varchar(20),
  `ncte` varchar(20),
  `aicte` varchar(20),
  `ugc` varchar(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tpo`
--

INSERT INTO `tpo` (`tid`, `tname`, `temail`, `tpassword`, `collegename`, `city`, `mobileno`, `website`, `nirf`, `nacc`, `ncte`, `aicte`, `ugc`) VALUES
(9, 'VipulDabhisir', 'vipuldabhi@gmail.com', '$2a$12$5acV8OmlNEu1/X8bL7HMsOLtv.46RkgS4XUVqBkDTMS.r5Yd28Yau', 'ddu', 'Nadiad', 6543219877, 'www.ddit.com', 120, 'yes', 'yes', 'no', 'no'),
(10, 'mmg sir', 'mmgsir@gmail.com', '$2a$12$jSx1bCgsYMaOJQEWKcFT6OzyRCoAnOrIcdU5Y5PQ8vjuaw4sDRIX2', 'nirma', 'Ahmedabad', 9992255555, 'www.nirma.com', 80, 'yes', 'no', 'yes', 'yes'),
(36, 'TPO', 'tpo@gmail.com', '$2a$12$GzxBa0l6dK3HEPJ7DqMAz.q1vtHBXouLadNoqEP1v1LvXlpnJkJHy', 'tpocollege', 'Patiala', 1235476980, 'https://www.thapar.edu/', 10, 'no', 'yes', 'yes', 'no'),
(37, 'bitmesra', 'bitmesra@gmail.com', '$2a$12$H.FK8RBsCGrYrLvNtFSi.eP5j3HDlBg5a4raPlJO7AtZsK/VmIelK', 'BIT MESRA', 'Ranchi', 9876543212, 'https://bitmesra.ac.in/', 55, 'yes', 'yes', 'yes', 'yes');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applied`
--
ALTER TABLE `applied`
  ADD PRIMARY KEY (`aid`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`cid`);

--
-- Indexes for table `jobdetail`
--
ALTER TABLE `jobdetail`
  ADD PRIMARY KEY (`jid`),
  ADD KEY `cid` (`cid`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`sid`);

--
-- Indexes for table `tpo`
--
ALTER TABLE `tpo`
  ADD PRIMARY KEY (`tid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applied`
--
ALTER TABLE `applied`
  MODIFY `aid` int(11) AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `cid` int(11) AUTO_INCREMENT COMMENT 'Auto increment', AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `jobdetail`
--
ALTER TABLE `jobdetail`
  MODIFY `jid` int(11) AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `sid` int(11) AUTO_INCREMENT COMMENT 'Auto increment', AUTO_INCREMENT=489;

--
-- AUTO_INCREMENT for table `tpo`
--
ALTER TABLE `tpo`
  MODIFY `tid` int(10) UNSIGNED AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
