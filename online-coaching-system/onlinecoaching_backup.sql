-- MySQL dump 10.13  Distrib 8.4.8, for Win64 (x86_64)
--
-- Host: localhost    Database: OnlineCoachingInstitute
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `unique_admin_user` (`user_id`),
  CONSTRAINT `fk_admin_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,23,'1234567890'),(2,24,'6473838832');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_conversations`
--

DROP TABLE IF EXISTS `ai_conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_conversations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `messages` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_conversations`
--

LOCK TABLES `ai_conversations` WRITE;
/*!40000 ALTER TABLE `ai_conversations` DISABLE KEYS */;
INSERT INTO `ai_conversations` VALUES (1,15,'Hello! I\'m your AI Learning As...','[{\"role\":\"system\",\"content\":\"RELEVANT COURSE MATERIAL:\\nCourse Content Context:\\n\\nCourse: jwbdjwbd\\nDescription: sdsd\\nLevel: Not specified\\nDuration: 432\\n\\nLectures:\\n\\n1. kdhfkd\\nDescription: ssdsd\\nVideo: http://localhost:8080/uploads/videos/71c04cf8-632f-402c-b7ef-2a38b6769c10.mp4\\nUploaded: 2026-07-31\\n\\n\\n\\nUse this context to provide more accurate and specific answers. Reference the course material when relevant. If the context doesn\'t contain information about the specific question, provide a helpful general response based on the course topic.\"},{\"role\":\"assistant\",\"content\":\"Hello! I\'m your AI Learning Assistant. I can help you with:\\n\\n• 📚 **Course Material** - Explain concepts from your courses\\n• 🎯 **Study Guidance** - Provide effective learning strategies\\n• 📝 **Quiz Generation** - Create practice quizzes from content\\n• 💻 **Code Help** - Debug and explain programming concepts\\n• 📋 **Assignment Ideas** - Generate assignments and interview questions\\n\\nHow can I assist you today?\"},{\"role\":\"user\",\"content\":\"Generate interview questions with the following structure:\\n\\n1. **Domain**: [e.g., Java, React, Database, System Design]\\n2. **Experience Level**: [Fresher/Mid-level/Senior]\\n3. **Number of Questions**: [Specify count]\\n\\nPlease include:\\n- Technical questions\\n- Problem-solving scenarios\\n- Behavioral questions\\n- Expected answers/key points\\n- Difficulty rating for each question\\n\\nWhat domain would you like interview questions for?\"},{\"role\":\"assistant\",\"content\":\"I\'d be happy to help with generating interview questions. Let\'s go with a combination of domains that are commonly asked in interviews.\\n\\nHere are the options:\\n\\n1. **Software Engineering** (Domain) - This includes various aspects of software development, such as algorithms, data structures, design patterns, and more.\\n2. **Data Science and Machine Learning** (Domain)\\n3. **Cloud Computing** (Domain)\\n\\nChoose one or two domains to generate interview questions for.\\n\\nAdditionally, I can provide the following experience levels:\\n\\n1. **Fresher**: For recent graduates or those with 0-3 years of experience.\\n2. **Mid-level**: For those with 4-7 years of experience.\\n3. **Senior**: For those with 8+ years of experience.\\n\\nPlease let me know which combination you prefer (Domain + Experience Level), and I\'ll generate the interview questions accordingly!\"}]','2026-08-07 13:31:14','2026-08-07 13:31:14'),(2,15,'Hello! I\'m your AI Learning As...','[{\"role\":\"system\",\"content\":\"RELEVANT COURSE MATERIAL:\\nCourse Content Context:\\n\\nCourse: Java Full Stack Development with Spring Boot & React\\nDescription: Learn to build modern full-stack web applications using Java, Spring Boot, MySQL, Hibernate, REST APIs, React.js, and JWT authentication. This course covers backend development, frontend integration, database design, deployment, and real-world projects. By the end of the course, students will be able to develop and deploy complete enterprise-level applications.\\nLevel: Not specified\\nDuration: 12 Weeks (90 Hours)\\n\\nLectures:\\n\\n1. Frontend vs Backend Development\\nDescription: This lecture explains the differences between Frontend and Backend Development and how they work together to build modern web applications.\\n\\nTopics Covered:\\n• What is Frontend Development?\\n• What is Backend Development?\\n• Roles and Responsibilities of Frontend and Backend Developers\\n• Frontend Technologies:\\n  - HTML\\n  - CSS\\n  - JavaScript\\n  - React.js\\n• Backend Technologies:\\n  - Java\\n  - Spring Boot\\n  - Node.js\\n  - Express.js\\n• APIs and Client-Server Communication\\n• Databases (MySQL, PostgreSQL)\\n• Authentication and Authorization\\n• How Frontend and Backend Communicate\\n• Full Stack Development Overview\\n\\nLearning Outcomes:\\n- Understand the difference between Frontend and Backend Development.\\n- Learn the technologies used in each layer.\\n- Understand how APIs connect the frontend with the backend.\\n- Gain a basic understanding of Full Stack Development.\\nVideo: https://youtu.be/vP3TRAsjZss?si=sTIGMA3hv4p5VR57\\nUploaded: 2026-07-28\\n\\nAssignments:\\n\\n1. dfdfdff\\nDescription: sfsf\\nTotal Marks: 100\\nCreated: 2026-07-28\\n\\n\\n\\nUse this context to provide more accurate and specific answers. Reference the course material when relevant. If the context doesn\'t contain information about the specific question, provide a helpful general response based on the course topic.\"},{\"role\":\"assistant\",\"content\":\"Hello! I\'m your AI Learning Assistant. I can help you with:\\n\\n• 📚 **Course Material** - Explain concepts from your courses\\n• 🎯 **Study Guidance** - Provide effective learning strategies\\n• 📝 **Quiz Generation** - Create practice quizzes from content\\n• 💻 **Code Help** - Debug and explain programming concepts\\n• 📋 **Assignment Ideas** - Generate assignments and interview questions\\n\\nHow can I assist you today?\"},{\"role\":\"user\",\"content\":\"Generate interview questions with the following structure:\\n\\n1. **Domain**: [e.g., Java, React, Database, System Design]\\n2. **Experience Level**: [Fresher/Mid-level/Senior]\\n3. **Number of Questions**: [Specify count]\\n\\nPlease include:\\n- Technical questions\\n- Problem-solving scenarios\\n- Behavioral questions\\n- Expected answers/key points\\n- Difficulty rating for each question\\n\\nWhat domain would you like interview questions for?\"},{\"role\":\"assistant\",\"content\":\"I\'d like to generate interview questions for the following domains:\\n\\n1. **Java Full Stack Development with Spring Boot**\\n2. **React.js and Frontend Development**\\n\\nLet\'s start with **Java Full Stack Development with Spring Boot**.\\n\\nHere are 5 interview questions for a mid-level candidate:\\n\\n**Domain: Java Full Stack Development with Spring Boot**\\n**Experience Level: Mid-level**\\n**Number of Questions: 5**\\n\\n1. **Technical Question**\\n**Difficulty Rating:** (6/10)\\n**Expected Answer:** Explain the concept of dependency injection in Spring Boot and provide an example of how it\'s used to inject dependencies into a service class.\\n\\n2. **Problem-Solving Scenario**\\n**Difficulty Rating:** (8/10)\\n**Expected Answer:** You are tasked with designing a RESTful API using Spring Boot that manages a collection of books. The API should have endpoints for adding, updating, and deleting books. Describe the endpoints you would create and the request/response body structures.\\n\\n3. **Behavioral Question**\\n**Difficulty Rating:** (4/10)\\n**Expected Answer:** Tell me about a time when you had to troubleshoot a complex issue in your previous project. How did you go about resolving it?\\n\\n4. **Technical Question**\\n**Difficulty Rating:** (7/10)\\n**Expected Answer:** Explain the concept of Spring Boot\'s auto-configuration feature and how it affects the behavior of the framework.\\n\\n5. **Problem-Solving Scenario**\\n**Difficulty Rating:** (8/10)\\n**Expected Answer:** You are given a SQL query that fetches all books with their corresponding authors. However, some books may not have an author associated with them. Describe how you would modify the query to include this logic and explain your thought process.\\n\\nPlease let me know if you\'d like me to generate questions for **React.js and Frontend Development** as well!\"}]','2026-08-07 13:32:47','2026-08-07 13:32:47'),(3,15,'Hello! I\'m your AI Learning As...','[{\"role\":\"system\",\"content\":\"RELEVANT COURSE MATERIAL:\\nCourse Content Context:\\n\\nCourse: Python Programming\\nDescription: Learn Python from basics to advanced concepts, including OOP, file handling, exception handling, and practical programming.\\nLevel: Not specified\\nDuration: 8 weeks, 50 hours\\n\\nLectures:\\n\\n1. Introduction to Python Programming\\nDescription: Learn the basics of Python programming, including what Python is, its key features, real-world applications, and how to set up the Python development environment.\\nVideo: https://youtu.be/q3AuP01daL4?si=AJigh0vtj_-gfE-v\\nUploaded: 2026-08-09\\n\\nAssignments:\\n\\n1. Python Basics – Variables, Data Types & Operators\\nDescription: Write a Python program that demonstrates different variables, data types, and operators. Create programs to perform arithmetic calculations, take input from the user, and display the results. Include comments explaining your code.\\nTotal Marks: 20\\nDeadline: 2026-08-20\\nCreated: 2026-08-09\\n\\n\\n\\nUse this context to provide more accurate and specific answers. Reference the course material when relevant. If the context doesn\'t contain information about the specific question, provide a helpful general response based on the course topic.\"},{\"role\":\"assistant\",\"content\":\"Hello! I\'m your AI Learning Assistant. I can help you with:\\n\\n• 📚 **Course Material** - Explain concepts from your courses\\n• 🎯 **Study Guidance** - Provide effective learning strategies\\n• 📝 **Quiz Generation** - Create practice quizzes from content\\n• 💻 **Code Help** - Debug and explain programming concepts\\n• 📋 **Assignment Ideas** - Generate assignments and interview questions\\n\\nHow can I assist you today?\"},{\"role\":\"user\",\"content\":\"Generate a comprehensive quiz with the following structure:\\n    \\n1. **Topic**: [Specify the topic]\\n2. **Difficulty Level**: [Beginner/Intermediate/Advanced]\\n3. **Number of Questions**: [Specify count]\\n\\nPlease include:\\n- Multiple Choice Questions (MCQs)\\n- True/False questions\\n- Short answer questions\\n- One coding problem (if applicable)\\n\\nFormat each question clearly with:\\n- Question text\\n- Options (for MCQs)\\n- Correct answer\\n- Brief explanation\\n\\nWhat topic would you like me to create a quiz for?\"},{\"role\":\"assistant\",\"content\":\"Let\'s create a comprehensive quiz on **Python Basics: Variables, Data Types & Operators**.\\n\\n**Quiz Details**\\n\\n1. **Topic**: Python Basics: Variables, Data Types & Operators\\n2. **Difficulty Level**: Beginner\\n3. **Number of Questions**: 10\\n\\nHere are the questions:\\n\\n**Multiple Choice Question (MCQ) - 4 points each**\\n\\n1. **Question**: What is the data type of the variable `x` in the following code: `x = 5`?\\n```python\\nx = 5\\n```\\nA) String\\nB) Integer\\nC) Float\\nD) Boolean\\n\\n**Correct Answer**: B) Integer\\n**Explanation**: In Python, integers are represented as decimal numbers without fractional parts. The variable `x` is assigned the value `5`, which is an integer.\\n\\n2. **Question**: Which operator performs addition in Python?\\n```python\\na = 3\\nb = 4\\nresult = a + b\\n```\\nA) `+`\\nB) `-`\\nC) `*`\\nD) `/`\\n\\n**Correct Answer**: A) `+`\\n**Explanation**: The `+` operator is used for addition in Python. The variables `a` and `b` are assigned values, then the result of their sum is stored in the variable `result`.\\n\\n3. **Question**: What is the output of the following code: `x = \\\"Hello\\\"`, `y = x[0]`?\\n```python\\nx = \\\"Hello\\\"\\ny = x[0]\\nprint(y)\\n```\\nA) `H`\\nB) `e`\\nC) `l`\\nD) `o`\\n\\n**Correct Answer**: A) `H`\\n**Explanation**: In Python, strings are indexed from 0. The variable `x` is assigned the string value `\\\"Hello\\\"`. The variable `y` is then assigned the first character of the string, which is `\'H\'`.\\n\\n4. **Question**: Which data type can be used to store multiple values?\\n```python\\nmy_list = [1, 2, 3]\\n```\\nA) String\\nB) Integer\\nC) Float\\nD) List\\n\\n**Correct Answer**: D) List\\n**Explanation**: In Python, lists are denoted by square brackets `[]` and can be used to store multiple values of the same data type.\\n\\n**True/False Question - 2 points each**\\n\\n5. **Question**: True or False: The variable `None` is a string in Python.\\n```python\\nx = None\\nprint(type(x))\\n```\\nA) True\\nB) False\\n\\n**Correct Answer**: B) False\\n**Explanation**: In Python, `None` is a special singleton object that represents the absence of any object value. It is not a string.\\n\\n6. **Question**: True or False: The operator `%` performs subtraction in Python.\\n```python\\na = 3\\nb = 4\\nresult = a - b\\n```\\nA) True\\nB) False\\n\\n**Correct Answer**: B) False\\n**Explanation**: In Python, the `%` operator is used for modulo (remainder) calculation. The variables `a` and `b` are assigned values, then the result of their difference is stored in the variable `result`.\\n\\n**Short Answer Question - 4 points**\\n\\n7. **Question**: What is the output of the following code: `x = \\\"Hello\\\"`, `y = x.upper()`?\\n```python\\nx = \\\"Hello\\\"\\ny = x.upper()\\nprint(y)\\n```\\n**Correct Answer**: HELLO\\n**Explanation**: In Python, the `upper()` method converts a string to uppercase. The variable `x` is assigned the string value `\\\"Hello\\\"`. The variable `y` is then assigned the result of converting `x` to uppercase.\\n\\n8. **Question**: What is the purpose of the `print()` function in Python?\\n**Correct Answer**: To display output on the screen.\\n**Explanation**: The `print()` function in Python is used to output values or expressions to the console.\\n\\n**Short Answer Question - 4 points**\\n\\n9. **Question**: How do you concatenate two strings in Python?\\n**Correct Answer**: Using the `+` operator: \\\"Hello\\\" + \\\"World\\\"\\n**Explanation**: In Python, strings can be concatenated using the `+` operator. For example, `\\\"Hello\\\"` + `\\\"World\\\"` produces the string `\\\"HelloWorld\\\"`.\\n\\n10. **Question**: What is a common use of the `input()` function in Python?\\n**Correct Answer**: To get user input\\n**Explanation**: The `input()` function in Python is used to read and return a line of input from the user.\"}]','2026-08-09 11:27:05','2026-08-09 11:27:05'),(4,41,'Hello! I\'m your AI Learning As...','[{\"role\":\"system\",\"content\":\"RELEVANT COURSE MATERIAL:\\nCourse Content Context:\\n\\nCourse: Data Science with Python\\nDescription: Learn Python, NumPy, Pandas, data visualization, statistics, and machine learning fundamentals through practical projects.\\nLevel: Not specified\\nDuration: 10 Weeks\\n\\nNote: No detailed course materials, lectures, or assignments are currently available for this course. The AI will provide general assistance based on the course topic and your questions.\\n\\n\\nUse this context to provide more accurate and specific answers. Reference the course material when relevant. If the context doesn\'t contain information about the specific question, provide a helpful general response based on the course topic.\"},{\"role\":\"assistant\",\"content\":\"Hello! I\'m your AI Learning Assistant. I can help you with:\\n\\n• 📚 **Course Material** - Explain concepts from your courses\\n• 🎯 **Study Guidance** - Provide effective learning strategies\\n• 📝 **Quiz Generation** - Create practice quizzes from content\\n• 💻 **Code Help** - Debug and explain programming concepts\\n• 📋 **Assignment Ideas** - Generate assignments and interview questions\\n\\nHow can I assist you today?\"},{\"role\":\"user\",\"content\":\"Generate a comprehensive quiz with the following structure:\\n    \\n1. **Topic**: [Specify the topic]\\n2. **Difficulty Level**: [Beginner/Intermediate/Advanced]\\n3. **Number of Questions**: [Specify count]\\n\\nPlease include:\\n- Multiple Choice Questions (MCQs)\\n- True/False questions\\n- Short answer questions\\n- One coding problem (if applicable)\\n\\nFormat each question clearly with:\\n- Question text\\n- Options (for MCQs)\\n- Correct answer\\n- Brief explanation\\n\\nWhat topic would you like me to create a quiz for?\"},{\"role\":\"assistant\",\"content\":\"Let\'s create a comprehensive quiz on **Data Visualization**.\\n\\nHere is your Data Visualization Quiz:\\n\\n1. **Topic**: Data Visualization\\n2. **Difficulty Level**: Intermediate\\n3. **Number of Questions**: 5\\n\\n**Question 1: Multiple Choice Question (MCQ)**\\n\\nWhat type of plot is suitable for showing the relationship between two continuous variables?\\n\\nA) Bar chart\\nB) Scatterplot\\nC) Histogram\\nD) Pie chart\\n\\n**Correct answer:** B) Scatterplot\\n\\n**Explanation:** A scatterplot is a type of plot that displays the relationship between two continuous variables. It\'s useful for visualizing patterns, trends, and correlations.\\n\\n**Question 2: True/False Question**\\n\\nTrue or False: The main purpose of data visualization is to make data more interesting.\\n\\n**Correct answer:** FALSE\\n\\n**Explanation:** While data visualization can be visually appealing, its primary goal is to help users understand complex data insights, communicate findings effectively, and inform decision-making.\\n\\n**Question 3: Short Answer Question**\\n\\nWhat are some common types of color palettes used in data visualization? Provide at least two examples. (Approx. 50-75 words)\\n\\n**Correct answer:** Some common color palettes include:\\n* Monochromatic: using different shades of a single color\\n* Complementary: pairing colors opposite each other on the color wheel (e.g., blue and orange)\\n* Analogous: using colors next to each other on the color wheel (e.g., blue, green, and yellow)\\n\\n**Question 4: Multiple Choice Question (MCQ)**\\n\\nWhich popular data visualization library is known for its ease of use and powerful features?\\n\\nA) Matplotlib\\nB) Seaborn\\nC) Plotly\\nD) Bokeh\\n\\n**Correct answer:** B) Seaborn\\n\\n**Explanation:** Seaborn is built on top of Matplotlib and provides a high-level interface for creating attractive and informative statistical graphics.\\n\\n**Question 5: Coding Problem**\\n\\nCreate a simple line plot using Python\'s matplotlib library to visualize the relationship between exam scores (in) and final grades (out). Assume a dataset is stored in a CSV file called \'exam_grades.csv\'.\\n\\n**Example Code:** \\n```python\\nimport matplotlib.pyplot as plt\\nimport pandas as pd\\n\\n# Load the data from the CSV file\\ndf = pd.read_csv(\'exam_grades.csv\')\\n\\n# Create a line plot of exam scores vs. final grades\\nplt.plot(df[\'in\'], df[\'out\'])\\nplt.xlabel(\'Exam Scores (in)\')\\nplt.ylabel(\'Final Grades (out)\')\\nplt.title(\'Relationship between Exam Scores and Final Grades\')\\nplt.show()\\n```\\n\\nPlease feel free to ask if you\'d like me to clarify or expand on any of the questions!\"}]','2026-08-10 03:15:27','2026-08-10 03:15:27');
/*!40000 ALTER TABLE `ai_conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analytics_events`
--

DROP TABLE IF EXISTS `analytics_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analytics_events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `event_name` varchar(255) NOT NULL,
  `properties` text,
  `session_id` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `user_role` varchar(255) DEFAULT NULL,
  `device_info` varchar(255) DEFAULT NULL,
  `app_version` varchar(255) DEFAULT NULL,
  `platform` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics_events`
--

LOCK TABLES `analytics_events` WRITE;
/*!40000 ALTER TABLE `analytics_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `analytics_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement` (
  `announcement_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `admin_id` bigint DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `announcement_type` enum('GENERAL','IMPORTANT','URGENT','ASSIGNMENT','EXAM') DEFAULT 'GENERAL',
  `priority` enum('LOW','MEDIUM','HIGH') DEFAULT 'MEDIUM',
  `attachment_url` varchar(255) DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') DEFAULT 'PUBLISHED',
  `publish_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expiry_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`announcement_id`),
  KEY `admin_id` (`admin_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_teacher` (`teacher_id`),
  KEY `idx_publish_date` (`publish_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `announcement_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `announcement_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`) ON DELETE SET NULL,
  CONSTRAINT `announcement_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcement_read`
--

DROP TABLE IF EXISTS `announcement_read`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement_read` (
  `read_id` int NOT NULL AUTO_INCREMENT,
  `announcement_id` int NOT NULL,
  `student_id` int NOT NULL,
  `read_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`read_id`),
  UNIQUE KEY `unique_read` (`announcement_id`,`student_id`),
  KEY `idx_student` (`student_id`),
  CONSTRAINT `announcement_read_ibfk_1` FOREIGN KEY (`announcement_id`) REFERENCES `announcement` (`announcement_id`) ON DELETE CASCADE,
  CONSTRAINT `announcement_read_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement_read`
--

LOCK TABLES `announcement_read` WRITE;
/*!40000 ALTER TABLE `announcement_read` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcement_read` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `total_marks` int DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  PRIMARY KEY (`assignment_id`),
  UNIQUE KEY `unique_assignment_title_course` (`title`,`course_id`),
  UNIQUE KEY `UK7dsqkqoovgh94vl5vil869vh` (`title`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
INSERT INTO `assignment` VALUES (6,6,'jnknx','sdsd',NULL,100,'2026-07-28'),(8,7,'dfdfdff','sfsf',NULL,100,'2026-07-28'),(15,14,'Python Basics – Variables, Data Types & Operators','Write a Python program that demonstrates different variables, data types, and operators. Create programs to perform arithmetic calculations, take input from the user, and display the results. Include comments explaining your code.','2026-08-20',20,'2026-08-09'),(16,7,'Java OOP Concepts','Create a Java program demonstrating OOP concepts including inheritance, polymorphism, encapsulation, and abstraction. Submit the source code along with a brief explanation of each concept.','2026-08-20',100,'2026-08-09');
/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('PRESENT','ABSENT','LATE','EXCUSED') DEFAULT 'PRESENT',
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `notes` text,
  `marked_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`attendance_id`),
  UNIQUE KEY `unique_attendance` (`student_id`,`course_id`,`attendance_date`),
  KEY `course_id` (`course_id`),
  KEY `marked_by` (`marked_by`),
  KEY `idx_student_course` (`student_id`,`course_id`),
  KEY `idx_date` (`attendance_date`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`marked_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `entity_type` varchar(255) NOT NULL,
  `entity_id` int DEFAULT NULL,
  `old_values` text,
  `new_values` text,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `new_value` text,
  `old_value` text,
  PRIMARY KEY (`log_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_entity` (`entity_type`,`entity_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log`
--

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
INSERT INTO `audit_log` VALUES (1,NULL,'LOGIN','USER',NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0','2026-08-09 13:50:28',NULL,NULL),(2,NULL,'CREATE','COURSE',1,NULL,NULL,'127.0.0.1','Mozilla/5.0','2026-08-09 13:50:28',NULL,NULL),(3,NULL,'UPDATE','USER',1,NULL,NULL,'127.0.0.1','Mozilla/5.0','2026-08-09 13:50:28','Active -> Inactive',NULL),(4,NULL,'LOGIN','USER',NULL,NULL,NULL,'192.168.1.1','Mozilla/5.0','2026-08-09 13:50:28',NULL,NULL),(5,NULL,'APPROVE','COURSE',1,NULL,NULL,'127.0.0.1','Mozilla/5.0','2026-08-09 13:50:28','Pending -> Approved',NULL),(6,NULL,'LOGIN','USER',NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0','2026-08-09 13:51:18',NULL,NULL),(7,NULL,'CREATE','COURSE',1,NULL,NULL,'127.0.0.1','Mozilla/5.0','2026-08-09 13:51:18',NULL,NULL),(8,NULL,'UPDATE','USER',1,NULL,NULL,'127.0.0.1','Mozilla/5.0','2026-08-09 13:51:18','Active -> Inactive',NULL),(9,NULL,'LOGIN','USER',NULL,NULL,NULL,'192.168.1.1','Mozilla/5.0','2026-08-09 13:51:18',NULL,NULL),(10,NULL,'APPROVE','COURSE',1,NULL,NULL,'127.0.0.1','Mozilla/5.0','2026-08-09 13:51:18','Pending -> Approved',NULL),(11,NULL,'LOGIN','USER',NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0','2026-08-09 13:51:19',NULL,NULL),(12,NULL,'CREATE','COURSE',1,NULL,NULL,'127.0.0.1','Mozilla/5.0','2026-08-09 13:51:19',NULL,NULL),(13,NULL,'UPDATE','USER',1,NULL,NULL,'127.0.0.1','Mozilla/5.0','2026-08-09 13:51:19','Active -> Inactive',NULL),(14,NULL,'LOGIN','USER',NULL,NULL,NULL,'192.168.1.1','Mozilla/5.0','2026-08-09 13:51:19',NULL,NULL),(15,NULL,'APPROVE','COURSE',1,NULL,NULL,'127.0.0.1','Mozilla/5.0','2026-08-09 13:51:19','Pending -> Approved',NULL);
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar_event`
--

DROP TABLE IF EXISTS `calendar_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendar_event` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_type` enum('ASSIGNMENT','QUIZ','LECTURE','LIVE_CLASS','EXAM','MEETING','OTHER') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `assignment_id` int DEFAULT NULL,
  `quiz_id` bigint DEFAULT NULL,
  `live_class_id` int DEFAULT NULL,
  `is_all_day` tinyint(1) DEFAULT '0',
  `reminder_minutes` int DEFAULT '15',
  `status` enum('SCHEDULED','COMPLETED','CANCELLED') DEFAULT 'SCHEDULED',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `course_id` (`course_id`),
  KEY `assignment_id` (`assignment_id`),
  KEY `quiz_id` (`quiz_id`),
  KEY `live_class_id` (`live_class_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_start_datetime` (`start_datetime`),
  KEY `idx_event_type` (`event_type`),
  KEY `idx_status` (`status`),
  CONSTRAINT `calendar_event_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `calendar_event_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE SET NULL,
  CONSTRAINT `calendar_event_ibfk_3` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`assignment_id`) ON DELETE SET NULL,
  CONSTRAINT `calendar_event_ibfk_4` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`) ON DELETE SET NULL,
  CONSTRAINT `calendar_event_ibfk_5` FOREIGN KEY (`live_class_id`) REFERENCES `live_class` (`live_class_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar_event`
--

LOCK TABLES `calendar_event` WRITE;
/*!40000 ALTER TABLE `calendar_event` DISABLE KEYS */;
/*!40000 ALTER TABLE `calendar_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `icon` varchar(255) DEFAULT NULL,
  `parent_category_id` int DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  KEY `idx_parent` (`parent_category_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `category_ibfk_1` FOREIGN KEY (`parent_category_id`) REFERENCES `category` (`category_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate`
--

DROP TABLE IF EXISTS `certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate` (
  `certificate_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `certificate_number` varchar(255) NOT NULL,
  `issue_date` date NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` enum('ACTIVE','REVOKED','EXPIRED') DEFAULT 'ACTIVE',
  `grade` varchar(255) DEFAULT NULL,
  `percentage` double DEFAULT NULL,
  `certificate_url` varchar(255) DEFAULT NULL,
  `verification_code` varchar(255) DEFAULT NULL,
  `issued_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`certificate_id`),
  UNIQUE KEY `certificate_number` (`certificate_number`),
  UNIQUE KEY `verification_code` (`verification_code`),
  KEY `issued_by` (`issued_by`),
  KEY `idx_student` (`student_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_verification` (`verification_code`),
  CONSTRAINT `certificate_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `certificate_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `certificate_ibfk_3` FOREIGN KEY (`issued_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate`
--

LOCK TABLES `certificate` WRITE;
/*!40000 ALTER TABLE `certificate` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `unique_course_title_teacher` (`title`,`teacher_id`),
  UNIQUE KEY `UKlug8xhg6lh7bxw369h4aiatea` (`title`,`teacher_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (6,'Machine Learning for Beginners','Learn the fundamentals of Machine Learning from scratch. This beginner-friendly course introduces the core concepts of data, algorithms, supervised and unsupervised learning, data preprocessing, model training, evaluation, and real-world applications of Machine Learning. No prior Machine Leaning experience is required.','12 hours','beginner',500.00,7,'2026-07-27'),(7,'Java Full Stack Development with Spring Boot & React','Learn to build modern full-stack web applications using Java, Spring Boot, MySQL, Hibernate, REST APIs, React.js, and JWT authentication. This course covers backend development, frontend integration, database design, deployment, and real-world projects. By the end of the course, students will be able to develop and deploy complete enterprise-level applications.','12 Weeks (90 Hours)',NULL,4999.00,7,'2026-07-28'),(8,'Data Structures & Algorithms in Java programming','Master Data Structures and Algorithms using Java. Learn Arrays, Strings, Linked Lists, Stacks, Queues, Trees, Graphs, Hashing, Dynamic Programming, Recursion, Sorting, Searching, and interview coding problems from beginner to advanced level.','10 Weeks (75 Hours)','',2999.00,7,'2026-07-28'),(14,'Python Programming','Learn Python from basics to advanced concepts, including OOP, file handling, exception handling, and practical programming.','8 weeks, 50 hours',NULL,78.00,7,'2026-08-09'),(15,'Data Science with Python','Learn Python, NumPy, Pandas, data visualization, statistics, and machine learning fundamentals through practical projects.','10 Weeks',NULL,12000.00,19,'2026-08-10'),(16,'dftgh','fghjn','4',NULL,89.00,7,'2026-08-10');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_approval`
--

DROP TABLE IF EXISTS `course_approval`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_approval` (
  `approval_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `submitted_by` int NOT NULL,
  `reviewed_by` int DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','REVISION_REQUIRED') DEFAULT 'PENDING',
  `review_notes` text,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`approval_id`),
  KEY `reviewed_by` (`reviewed_by`),
  KEY `idx_course` (`course_id`),
  KEY `idx_status` (`status`),
  KEY `idx_submitted_by` (`submitted_by`),
  CONSTRAINT `course_approval_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `course_approval_ibfk_2` FOREIGN KEY (`submitted_by`) REFERENCES `user` (`user_id`),
  CONSTRAINT `course_approval_ibfk_3` FOREIGN KEY (`reviewed_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_approval`
--

LOCK TABLES `course_approval` WRITE;
/*!40000 ALTER TABLE `course_approval` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_approval` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_category`
--

DROP TABLE IF EXISTS `course_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_category` (
  `course_category_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`course_category_id`),
  UNIQUE KEY `unique_course_category` (`course_id`,`category_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_category` (`category_id`),
  CONSTRAINT `course_category_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `course_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_category`
--

LOCK TABLES `course_category` WRITE;
/*!40000 ALTER TABLE `course_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_rating`
--

DROP TABLE IF EXISTS `course_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_rating` (
  `rating_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `rating_date` date NOT NULL,
  PRIMARY KEY (`rating_id`),
  UNIQUE KEY `student_id` (`student_id`,`course_id`),
  UNIQUE KEY `UKrb0j362xseh3kaxla2rt21adi` (`student_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `course_rating_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `course_rating_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  CONSTRAINT `course_rating_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_rating`
--

LOCK TABLES `course_rating` WRITE;
/*!40000 ALTER TABLE `course_rating` DISABLE KEYS */;
INSERT INTO `course_rating` VALUES (1,11,6,4,'bkbkbkbkb','2026-07-28'),(2,11,7,3,'it is an good course 1','2026-07-28'),(4,11,14,4,'','2026-08-09'),(5,24,15,5,'','2026-08-10'),(6,25,6,5,'good\n','2026-08-10');
/*!40000 ALTER TABLE `course_rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_review`
--

DROP TABLE IF EXISTS `course_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_review` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `student_id` int NOT NULL,
  `rating` int NOT NULL,
  `review_text` text,
  `is_verified` tinyint(1) DEFAULT '0',
  `helpful_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_student` (`student_id`),
  CONSTRAINT `course_review_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `course_review_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_review`
--

LOCK TABLES `course_review` WRITE;
/*!40000 ALTER TABLE `course_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discussion_forum`
--

DROP TABLE IF EXISTS `discussion_forum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discussion_forum` (
  `forum_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `student_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `tags` text,
  `status` enum('OPEN','CLOSED','ARCHIVED') DEFAULT 'OPEN',
  `is_pinned` tinyint(1) DEFAULT '0',
  `is_answered` tinyint(1) DEFAULT '0',
  `views` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`forum_id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `discussion_forum_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `discussion_forum_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE SET NULL,
  CONSTRAINT `discussion_forum_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discussion_forum`
--

LOCK TABLES `discussion_forum` WRITE;
/*!40000 ALTER TABLE `discussion_forum` DISABLE KEYS */;
INSERT INTO `discussion_forum` VALUES (5,6,NULL,7,'Difference Between ArrayList and LinkedList','Hello everyone,\n\nLet\'s discuss the differences between ArrayList and LinkedList in Java.\n\nPlease answer the following:\n\nWhen should you use an ArrayList?\nWhen should you use a LinkedList?\nWhich operations are faster in each?\nShare a practical example where you have used either one.\n\nFeel free to explain with code snippets if possible.','Technical',NULL,'OPEN',NULL,0,0,'2026-08-07 14:03:57','2026-08-07 14:03:57'),(6,6,NULL,7,'Important Topics for the Upcoming Java Assessment','Dear Students,\n\nPlease review the topics covered in the recent Java classes, especially OOP concepts, exception handling, collections, and multithreading. If you have any questions or difficulties with these topics, post them in this discussion so we can address them together.\n\nPlease make sure to participate and help your classmates where possible.','General',NULL,'OPEN',0,0,0,'2026-08-09 11:17:27','2026-08-09 11:17:27'),(7,15,NULL,19,'Understanding Exception Handling in Java','What is the difference between checked and unchecked exceptions in Java? Please share examples of when to use try-catch, throws, and finally. Students can also discuss common mistakes when handling exceptions.','Technical',NULL,'OPEN',0,0,0,'2026-08-10 03:14:37','2026-08-10 03:14:37'),(8,6,NULL,7,'dfghkjnkm','fghbjn','General',NULL,'OPEN',0,0,0,'2026-08-10 07:56:26','2026-08-10 07:56:26');
/*!40000 ALTER TABLE `discussion_forum` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discussion_reply`
--

DROP TABLE IF EXISTS `discussion_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discussion_reply` (
  `reply_id` int NOT NULL AUTO_INCREMENT,
  `forum_id` int NOT NULL,
  `student_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `is_accepted_answer` tinyint(1) DEFAULT '0',
  `parent_reply_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`reply_id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `parent_reply_id` (`parent_reply_id`),
  KEY `idx_forum` (`forum_id`),
  KEY `idx_student` (`student_id`),
  CONSTRAINT `discussion_reply_ibfk_1` FOREIGN KEY (`forum_id`) REFERENCES `discussion_forum` (`forum_id`) ON DELETE CASCADE,
  CONSTRAINT `discussion_reply_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE SET NULL,
  CONSTRAINT `discussion_reply_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`) ON DELETE SET NULL,
  CONSTRAINT `discussion_reply_ibfk_4` FOREIGN KEY (`parent_reply_id`) REFERENCES `discussion_reply` (`reply_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discussion_reply`
--

LOCK TABLES `discussion_reply` WRITE;
/*!40000 ALTER TABLE `discussion_reply` DISABLE KEYS */;
INSERT INTO `discussion_reply` VALUES (3,5,11,NULL,'I think ArrayList is better when we need fast random access because it stores elements in a dynamic array. LinkedList is more suitable when there are frequent insertions and deletions in the middle of the list. However, accessing elements by index is slower in LinkedList.',0,NULL,'2026-08-07 14:05:01','2026-08-07 14:05:01'),(4,6,11,NULL,'Thank you, sir. I’ll review OOP concepts, exception handling, collections, and multithreading and prepare for the upcoming Java assessment.\n',0,NULL,'2026-08-09 11:38:24','2026-08-09 11:38:24');
/*!40000 ALTER TABLE `discussion_reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollment` (
  `enroll_id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `enroll_date` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `amount_paid` double DEFAULT NULL,
  `enrollment_date` datetime DEFAULT NULL,
  `plan_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`enroll_id`),
  UNIQUE KEY `unique_enrollment_student_course` (`student_id`,`course_id`),
  UNIQUE KEY `UK5h61t1j3swq1guy2hejyv6uqa` (`student_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment`
--

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;
INSERT INTO `enrollment` VALUES (5,11,6,'2026-07-27','active',NULL,NULL,NULL),(6,11,7,'2026-07-28','active',NULL,NULL,NULL),(7,11,8,'2026-07-31','active',NULL,NULL,NULL),(18,11,14,'2026-08-09','active',78,NULL,'standard'),(19,16,7,'2026-08-09','active',4999,NULL,'standard'),(20,24,15,'2026-08-10','active',12000,NULL,'standard'),(21,25,6,'2026-08-10','active',500,NULL,'standard');
/*!40000 ALTER TABLE `enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `invoice_id` int NOT NULL AUTO_INCREMENT,
  `payment_id` bigint NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `status` enum('DRAFT','SENT','PAID','OVERDUE','CANCELLED') DEFAULT 'SENT',
  `subtotal` decimal(10,2) DEFAULT NULL,
  `tax` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `notes` text,
  `pdf_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`invoice_id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `idx_payment` (`payment_id`),
  KEY `idx_invoice_number` (`invoice_number`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecture`
--

DROP TABLE IF EXISTS `lecture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecture` (
  `lecture_id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `video_url` varchar(255) DEFAULT NULL,
  `lecture_order` int DEFAULT NULL,
  `upload_date` date DEFAULT NULL,
  PRIMARY KEY (`lecture_id`),
  UNIQUE KEY `unique_lecture_title_course` (`title`,`course_id`),
  UNIQUE KEY `UKivamlbajre4d510qcbai23n1r` (`title`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `lecture_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecture`
--

LOCK TABLES `lecture` WRITE;
/*!40000 ALTER TABLE `lecture` DISABLE KEYS */;
INSERT INTO `lecture` VALUES (4,6,'Machine learning course for beginners','This course is very helpful for the beginner leve','https://youtu.be/8WzSEikpHk8?si=SBXcyRcHlntqV0YU',1,'2026-07-27'),(5,7,'Frontend vs Backend Development','This lecture explains the differences between Frontend and Backend Development and how they work together to build modern web applications.\n\nTopics Covered:\n• What is Frontend Development?\n• What is Backend Development?\n• Roles and Responsibilities of Frontend and Backend Developers\n• Frontend Technologies:\n  - HTML\n  - CSS\n  - JavaScript\n  - React.js\n• Backend Technologies:\n  - Java\n  - Spring Boot\n  - Node.js\n  - Express.js\n• APIs and Client-Server Communication\n• Databases (MySQL, PostgreSQL)\n• Authentication and Authorization\n• How Frontend and Backend Communicate\n• Full Stack Development Overview\n\nLearning Outcomes:\n- Understand the difference between Frontend and Backend Development.\n- Learn the technologies used in each layer.\n- Understand how APIs connect the frontend with the backend.\n- Gain a basic understanding of Full Stack Development.','https://youtu.be/vP3TRAsjZss?si=sTIGMA3hv4p5VR57',1,'2026-07-28'),(7,6,'xcxcsdsd','sdsd','http://localhost:8080/uploads/videos/0270ad2c-2c02-4dde-b0ef-beb24f974144.mp4',1,'2026-07-31'),(18,14,'Introduction to Python Programming','Learn the basics of Python programming, including what Python is, its key features, real-world applications, and how to set up the Python development environment.','https://youtu.be/q3AuP01daL4?si=AJigh0vtj_-gfE-v',1,'2026-08-09');
/*!40000 ALTER TABLE `lecture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecture_progress`
--

DROP TABLE IF EXISTS `lecture_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecture_progress` (
  `progress_id` int NOT NULL AUTO_INCREMENT,
  `completed_at` datetime(6) DEFAULT NULL,
  `last_watched` datetime(6) DEFAULT NULL,
  `watch_percentage` int DEFAULT NULL,
  `watched` bit(1) DEFAULT NULL,
  `lecture_id` bigint NOT NULL,
  `student_id` int NOT NULL,
  PRIMARY KEY (`progress_id`),
  UNIQUE KEY `UKk0wueubsbwbsuejvsoh5shv4i` (`student_id`,`lecture_id`),
  KEY `FK9ru6rl24b7m5tvrrmtunoxqrj` (`lecture_id`),
  CONSTRAINT `FK9ru6rl24b7m5tvrrmtunoxqrj` FOREIGN KEY (`lecture_id`) REFERENCES `lecture` (`lecture_id`),
  CONSTRAINT `FKt2f1csnhlnvbalrag92x3nfu4` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecture_progress`
--

LOCK TABLES `lecture_progress` WRITE;
/*!40000 ALTER TABLE `lecture_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecture_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `live_class`
--

DROP TABLE IF EXISTS `live_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `live_class` (
  `live_class_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `teacher_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `meeting_link` varchar(255) DEFAULT NULL,
  `meeting_id` varchar(255) DEFAULT NULL,
  `meeting_password` varchar(255) DEFAULT NULL,
  `scheduled_date` datetime NOT NULL,
  `duration` int DEFAULT NULL,
  `status` enum('SCHEDULED','LIVE','COMPLETED','CANCELLED') DEFAULT 'SCHEDULED',
  `recording_url` varchar(255) DEFAULT NULL,
  `max_participants` int DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`live_class_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_course` (`course_id`),
  KEY `idx_teacher` (`teacher_id`),
  KEY `idx_scheduled_date` (`scheduled_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `live_class_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `live_class_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`) ON DELETE CASCADE,
  CONSTRAINT `live_class_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `live_class`
--

LOCK TABLES `live_class` WRITE;
/*!40000 ALTER TABLE `live_class` DISABLE KEYS */;
/*!40000 ALTER TABLE `live_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `live_class_participant`
--

DROP TABLE IF EXISTS `live_class_participant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `live_class_participant` (
  `participant_id` int NOT NULL AUTO_INCREMENT,
  `live_class_id` int NOT NULL,
  `student_id` int NOT NULL,
  `join_time` timestamp NULL DEFAULT NULL,
  `leave_time` timestamp NULL DEFAULT NULL,
  `duration_attended` int DEFAULT '0',
  `status` enum('JOINED','LEFT','MISSED') DEFAULT 'MISSED',
  PRIMARY KEY (`participant_id`),
  UNIQUE KEY `unique_participant` (`live_class_id`,`student_id`),
  KEY `idx_student` (`student_id`),
  CONSTRAINT `live_class_participant_ibfk_1` FOREIGN KEY (`live_class_id`) REFERENCES `live_class` (`live_class_id`) ON DELETE CASCADE,
  CONSTRAINT `live_class_participant_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `live_class_participant`
--

LOCK TABLES `live_class_participant` WRITE;
/*!40000 ALTER TABLE `live_class_participant` DISABLE KEYS */;
/*!40000 ALTER TABLE `live_class_participant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `message_id` bigint NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `message_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_preference`
--

DROP TABLE IF EXISTS `notification_preference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_preference` (
  `preference_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `notification_type` enum('EMAIL','PUSH','SMS','IN_APP') NOT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `category` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`preference_id`),
  UNIQUE KEY `unique_preference` (`user_id`,`notification_type`,`category`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `notification_preference_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_preference`
--

LOCK TABLES `notification_preference` WRITE;
/*!40000 ALTER TABLE `notification_preference` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_preference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `expiry_time` datetime(6) DEFAULT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `used` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_token`
--

LOCK TABLES `password_reset_token` WRITE;
/*!40000 ALTER TABLE `password_reset_token` DISABLE KEYS */;
INSERT INTO `password_reset_token` VALUES (2,'john@gmail.com','2026-06-10 23:57:13.152943','590940',_binary ''),(3,'shailesh@gmail.com','2026-07-28 14:23:44.473085','304470',_binary '');
/*!40000 ALTER TABLE `password_reset_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `currency` varchar(255) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) NOT NULL,
  `plan_type` varchar(255) DEFAULT NULL,
  `razorpay_order_id` varchar(255) NOT NULL,
  `razorpay_payment_id` varchar(255) NOT NULL,
  `razorpay_signature` varchar(255) NOT NULL,
  `receipt` varchar(255) DEFAULT NULL,
  `refund_amount` double DEFAULT NULL,
  `refund_created_at` datetime(6) DEFAULT NULL,
  `refund_id` varchar(255) DEFAULT NULL,
  `refund_status` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqxxpw5eivmhcyql18tc8bmsa1` (`course_id`),
  KEY `FKo0lgt74t3bsgmnfq54pcdew7y` (`student_id`),
  CONSTRAINT `FKo0lgt74t3bsgmnfq54pcdew7y` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `FKqxxpw5eivmhcyql18tc8bmsa1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform_settings`
--

DROP TABLE IF EXISTS `platform_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platform_settings` (
  `settings_id` int NOT NULL AUTO_INCREMENT,
  `allowed_video_formats` text,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `default_course_approval_required` bit(1) DEFAULT NULL,
  `maintenance_mode` bit(1) DEFAULT NULL,
  `max_file_size_mb` int DEFAULT NULL,
  `platform_description` text,
  `platform_name` varchar(100) DEFAULT NULL,
  `registration_enabled` bit(1) DEFAULT NULL,
  `teacher_registration_requires_approval` bit(1) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`settings_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform_settings`
--

LOCK TABLES `platform_settings` WRITE;
/*!40000 ALTER TABLE `platform_settings` DISABLE KEYS */;
INSERT INTO `platform_settings` VALUES (1,'mp4,avi,mov,mkv','admin@onlinecoaching.com',NULL,'2026-08-09 18:04:28.793332',_binary '\0',_binary '\0',100,NULL,'Online Coaching',_binary '',_binary '','2026-08-09 18:04:28.793332');
/*!40000 ALTER TABLE `platform_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `push_subscription`
--

DROP TABLE IF EXISTS `push_subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `push_subscription` (
  `subscription_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `endpoint` text NOT NULL,
  `p256dh_key` varchar(255) NOT NULL,
  `auth_key` varchar(255) NOT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_used_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`subscription_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `push_subscription_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `push_subscription`
--

LOCK TABLES `push_subscription` WRITE;
/*!40000 ALTER TABLE `push_subscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `push_subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `quiz_id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `total_marks` int DEFAULT NULL,
  `quiz_date` date DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `passing_score` int DEFAULT NULL,
  `questions` longtext,
  PRIMARY KEY (`quiz_id`),
  UNIQUE KEY `unique_quiz_title_course` (`title`,`course_id`),
  UNIQUE KEY `UK2mjryojyqacbheka97t3gswo8` (`title`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
INSERT INTO `quiz` VALUES (5,6,'Machine Learning Fundamentals Quiz','This quiz tests the student\'s understanding of the fundamental concepts of Machine Learning, including Artificial Intelligence, supervised and unsupervised learning, datasets, features, labels, model training, and basic Machine Learning applications.',60,NULL,NULL,NULL,NULL),(6,7,'Frontend vs Backend Development Quiz','This quiz tests your understanding of Frontend and Backend Development, including their roles, technologies, APIs, databases, and full-stack concepts.',60,NULL,30,60,'[{\"question\":\"Which technology is primarily used for Frontend development?\",\"options\":[\"React.js\",\"Spring Boot\",\"MySQL\",\"Java\"],\"correctAnswer\":0,\"questionId\":1},{\"question\":\"Which of the following is a Backend framework?\",\"options\":[\"Bootstrap\",\"React.js\",\"Spring Boot\",\"CSS\"],\"correctAnswer\":2,\"questionId\":2}]'),(7,7,'Java Programming Fundamentals Quiz','This quiz evaluates your understanding of Java programming fundamentals, including OOP concepts, data types, loops, exception handling, collections, and JVM architecture.',60,NULL,25,60,'[{\"question\":\"Which of the following is not a Java primitive data type?\",\"options\":[\"int\",\"String\",\"Boolean\",\"Double\"],\"correctAnswer\":1,\"questionId\":1},{\"question\":\"Which keyword is used to inherit a class in Java?\",\"options\":[\"extends\",\"implemets\",\"inherits\",\"super\"],\"correctAnswer\":0,\"questionId\":2}]'),(9,7,'Java Fundamentals Quiz','This quiz evaluates your understanding of Java basics, including OOP concepts, data types, operators, loops, arrays, and exception handling. Read each question carefully before submitting.',60,NULL,30,60,'[{\"question\":\"Which keyword is used to create an object in Java?\",\"options\":[\"new\",\"class\",\"this\",\"static\"],\"correctAnswer\":0,\"questionId\":1},{\"question\":\"Which of the following is not a primitive data type in Java?\",\"options\":[\"int\",\"float\",\"String\",\"char\"],\"correctAnswer\":2,\"questionId\":2}]'),(10,14,'Python Programming – Basics Quiz','Test your understanding of Python fundamentals, including variables, data types, operators, input/output, and basic syntax.',60,NULL,15,60,'[{\"question\":\"Which keyword is used to define a function in Python?\",\"options\":[\"function\",\"def\",\"func\",\"define\"],\"correctAnswer\":1,\"questionId\":1},{\"question\":\"Which of the following is a valid Python variable name?\",\"options\":[\"2name\",\"my-name\",\"my_name\",\"class\"],\"correctAnswer\":2,\"questionId\":2},{\"question\":\"What is the data type of 10 in Python?\",\"options\":[\"float\",\"string\",\"integer\",\"Option 1: float Option 2: string Option 3: integer Option 4: boolean\"],\"correctAnswer\":2,\"questionId\":3},{\"question\":\"Which function is used to take input from the user?\",\"options\":[\"scan()\",\"input()\",\"read()\",\"get()\"],\"correctAnswer\":1,\"questionId\":4},{\"question\":\"What is the output of print(10 // 3)?\",\"options\":[\"3.33\",\"3\",\"1\",\"4\"],\"correctAnswer\":1,\"questionId\":5}]');
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_submission`
--

DROP TABLE IF EXISTS `quiz_submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_submission` (
  `submission_id` bigint NOT NULL AUTO_INCREMENT,
  `score` int NOT NULL,
  `submitted_date` date DEFAULT NULL,
  `quiz_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`submission_id`),
  UNIQUE KEY `UK32ijtcxd8cqf3m2cxxg0u04ep` (`quiz_id`,`student_id`),
  CONSTRAINT `FKmth4ldfyfpfbti7bw8aprrofb` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_submission`
--

LOCK TABLES `quiz_submission` WRITE;
/*!40000 ALTER TABLE `quiz_submission` DISABLE KEYS */;
INSERT INTO `quiz_submission` VALUES (1,50,'2026-07-28',6,11),(2,0,'2026-07-28',7,11),(4,100,'2026-08-07',9,11),(6,60,'2026-08-09',10,11),(7,0,'2026-08-09',6,16),(8,100,'2026-08-09',7,16);
/*!40000 ALTER TABLE `quiz_submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `rating_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `rating` int NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `rating_date` date DEFAULT NULL,
  PRIMARY KEY (`rating_id`),
  UNIQUE KEY `student_id` (`student_id`,`teacher_id`),
  UNIQUE KEY `UK49tcyppu0pdx18g93lmmxsx20` (`student_id`,`teacher_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`),
  CONSTRAINT `rating_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `result`
--

DROP TABLE IF EXISTS `result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `result` (
  `result_id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `total_marks` int DEFAULT NULL,
  `assignment_marks` int DEFAULT NULL,
  `quiz_score` int DEFAULT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `result_date` date DEFAULT NULL,
  PRIMARY KEY (`result_id`),
  UNIQUE KEY `UKl10in1qejnll6t9ru6apiajc6` (`student_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `result_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `result_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `result`
--

LOCK TABLES `result` WRITE;
/*!40000 ALTER TABLE `result` DISABLE KEYS */;
INSERT INTO `result` VALUES (1,11,6,26,26,NULL,'F','2026-07-28'),(2,11,7,72,45,100,'C','2026-07-28'),(5,11,14,47,35,60,'E','2026-08-09'),(6,16,7,100,NULL,100,'A','2026-08-09');
/*!40000 ALTER TABLE `result` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `unique_student_user` (`user_id`),
  CONSTRAINT `fk_student_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (11,14,'73838388383','',NULL,'2026-07-24','','http://localhost:8080/uploads/profiles/1c264f63-a365-438e-8436-3a1e19983a3a.jpeg'),(16,27,'9999999999','',NULL,'2026-08-09','',NULL),(21,35,'9876543217',NULL,NULL,'2026-08-09',NULL,NULL),(24,42,'9876543215',NULL,NULL,'2026-08-10',NULL,NULL),(25,43,'9876543215',NULL,NULL,'2026-08-10',NULL,NULL),(26,44,'1234567890',NULL,NULL,'2026-08-10',NULL,NULL);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_progress`
--

DROP TABLE IF EXISTS `student_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_progress` (
  `progress_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `lecture_id` bigint DEFAULT NULL,
  `completion_percentage` double DEFAULT NULL,
  `last_watched_lecture_id` bigint DEFAULT NULL,
  `last_watched_timestamp` timestamp NULL DEFAULT NULL,
  `total_time_spent` int DEFAULT '0',
  `completed_lectures` text,
  `bookmarked_lectures` text,
  `notes` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`progress_id`),
  UNIQUE KEY `unique_progress` (`student_id`,`course_id`),
  KEY `course_id` (`course_id`),
  KEY `lecture_id` (`lecture_id`),
  KEY `idx_student_course` (`student_id`,`course_id`),
  KEY `FKcwxao9ck1g2tspvw2bb4vbq3i` (`last_watched_lecture_id`),
  CONSTRAINT `FKcwxao9ck1g2tspvw2bb4vbq3i` FOREIGN KEY (`last_watched_lecture_id`) REFERENCES `lecture` (`lecture_id`),
  CONSTRAINT `student_progress_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `student_progress_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `student_progress_ibfk_3` FOREIGN KEY (`lecture_id`) REFERENCES `lecture` (`lecture_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_progress`
--

LOCK TABLES `student_progress` WRITE;
/*!40000 ALTER TABLE `student_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_material`
--

DROP TABLE IF EXISTS `study_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_material` (
  `material_id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `upload_date` date DEFAULT NULL,
  PRIMARY KEY (`material_id`),
  UNIQUE KEY `unique_material_title_course` (`title`,`course_id`),
  UNIQUE KEY `UKpjrf7poflh2yi2xwo97hrqmam` (`title`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `study_material_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_material`
--

LOCK TABLES `study_material` WRITE;
/*!40000 ALTER TABLE `study_material` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission`
--

DROP TABLE IF EXISTS `submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission` (
  `submission_id` bigint NOT NULL AUTO_INCREMENT,
  `assignment_id` int NOT NULL,
  `student_id` int NOT NULL,
  `submission_date` date DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `marks_obtained` int DEFAULT NULL,
  `feedback` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`submission_id`),
  UNIQUE KEY `UK4ns1x9mexy6de9qfkwb77omwh` (`assignment_id`,`student_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `submission_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`assignment_id`),
  CONSTRAINT `submission_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission`
--

LOCK TABLES `submission` WRITE;
/*!40000 ALTER TABLE `submission` DISABLE KEYS */;
INSERT INTO `submission` VALUES (3,6,11,'2026-07-28','blob:http://localhost:3000/5691adaa-e871-4f0d-8bf5-9aae84a86e56',26,'good'),(4,8,11,'2026-07-28','http://localhost:8080/uploads/assignments/43ef9153-d73e-46a7-99fe-3f42177d1575.pdf',45,'Practice more'),(7,15,11,'2026-08-09','http://localhost:8080/uploads/assignments/68875b96-219c-446a-9072-c56a69653f7d.pdf',35,'Need to improve '),(8,8,16,'2026-08-09','http://localhost:8080/uploads/assignments/858ecdc0-765a-4741-9d4e-d0c16bfc2ea3.pdf',NULL,NULL);
/*!40000 ALTER TABLE `submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_ticket`
--

DROP TABLE IF EXISTS `support_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_ticket` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `ticket_number` varchar(255) NOT NULL,
  `category` enum('TECHNICAL','BILLING','ACCOUNT','COURSE_CONTENT','ENROLLMENT','CERTIFICATE','OTHER') NOT NULL,
  `priority` enum('LOW','MEDIUM','HIGH','URGENT') DEFAULT 'MEDIUM',
  `status` enum('OPEN','IN_PROGRESS','RESOLVED','CLOSED') DEFAULT 'OPEN',
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `assigned_to` int DEFAULT NULL,
  `resolution` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  UNIQUE KEY `ticket_number` (`ticket_number`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `support_ticket_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_ticket`
--

LOCK TABLES `support_ticket` WRITE;
/*!40000 ALTER TABLE `support_ticket` DISABLE KEYS */;
INSERT INTO `support_ticket` VALUES (1,14,'TKT-1786279903791','BILLING','MEDIUM','RESOLVED','fyyguli','guhijkl','',NULL,'gujhikol','2026-08-09 12:51:44','2026-08-09 12:52:17','2026-08-09 12:52:17'),(2,43,'TKT-1786338017646','TECHNICAL','MEDIUM','RESOLVED','gfdhytr','ytbgrvf','',NULL,'kjghf','2026-08-10 05:00:18','2026-08-10 05:04:10','2026-08-10 05:04:10'),(3,14,'TKT-1786349878366','TECHNICAL','MEDIUM','OPEN','dfhgjh','xcghgj','',NULL,NULL,'2026-08-10 08:17:58','2026-08-10 08:17:58',NULL);
/*!40000 ALTER TABLE `support_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_backup`
--

DROP TABLE IF EXISTS `system_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_backup` (
  `backup_id` int NOT NULL AUTO_INCREMENT,
  `backup_name` varchar(255) NOT NULL,
  `backup_type` enum('FULL','INCREMENTAL','DATABASE','FILES') DEFAULT 'FULL',
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `status` enum('IN_PROGRESS','COMPLETED','FAILED') DEFAULT 'IN_PROGRESS',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`backup_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_status` (`status`),
  CONSTRAINT `system_backup_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_backup`
--

LOCK TABLES `system_backup` WRITE;
/*!40000 ALTER TABLE `system_backup` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_setting`
--

DROP TABLE IF EXISTS `system_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_setting` (
  `setting_id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` text,
  `setting_type` enum('STRING','INTEGER','BOOLEAN','JSON') DEFAULT 'STRING',
  `category` varchar(100) DEFAULT NULL,
  `description` text,
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `updated_by` (`updated_by`),
  KEY `idx_category` (`category`),
  KEY `idx_key` (`setting_key`),
  CONSTRAINT `system_setting_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `user` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_setting`
--

LOCK TABLES `system_setting` WRITE;
/*!40000 ALTER TABLE `system_setting` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `expertise` varchar(255) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`teacher_id`),
  UNIQUE KEY `unique_teacher_user` (`user_id`),
  CONSTRAINT `fk_teacher_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (7,15,'+91 7847448483','',NULL,'2026-07-24','Hello rom machine learning','http://localhost:8080/uploads/profiles/f3cffcb5-7c56-4dd2-b11f-bc5d68cdc56d.jpeg'),(15,34,'9123456708',NULL,NULL,'2026-08-09',NULL,NULL),(16,38,'9876543220',NULL,NULL,'2026-08-09',NULL,NULL),(19,41,'9876543217',NULL,NULL,'2026-08-10',NULL,NULL);
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_achievements`
--

DROP TABLE IF EXISTS `teacher_achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_achievements` (
  `teacher_id` int NOT NULL,
  `achievement` varchar(255) NOT NULL,
  PRIMARY KEY (`teacher_id`,`achievement`),
  CONSTRAINT `teacher_achievements_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_achievements`
--

LOCK TABLES `teacher_achievements` WRITE;
/*!40000 ALTER TABLE `teacher_achievements` DISABLE KEYS */;
INSERT INTO `teacher_achievements` VALUES (7,'Best teacher award for 2025');
/*!40000 ALTER TABLE `teacher_achievements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (7,'Teacher Name','teacher@example.com',NULL,'TEACHER'),(14,'doe','doe@gmail.com','$2a$10$biLjHaPke97upH86Q7iFxOXb2b2cxHzxwm..Q6Aqb6I3L5QeRQWtK','STUDENT'),(15,'shailesh','shailesh@gmail.com','$2a$10$AuH3UiLzXMatbsp8Mok16.G2RlJJREe5MDwhqUfBsEWBRdMvioTna','TEACHER'),(23,'Test Admin','admin@test.com','$2a$10$2liSIWq4uG7Nr5W1dCHrIubBc2W0rkU.vYlZvjxVaFlvXU7HEr5kS','ADMIN'),(24,'admin2','admin2@gmail.com','$2a$10$tCox2DQl4yL3a4YG1C0njeu4Lg8K/hq8BQzrcm2MxVBpoeMvozfU6','ADMIN'),(27,'sushil','sushil@gmail.com','$2a$10$CX.pocO2Vdc8cQanwQNVBeK.IO5cuTTB1ULo4PE8YVNKPcjmv.k/q','STUDENT'),(34,'Neha Patil','neha.patil@example.com','$2a$10$PnCNI.cvV/16zFgfqlF4Au9lgs74nfLz/GJ07GCru5JbVkt6HclUi','TEACHER'),(35,'Vikram Singh','vikram.singh@example.com','$2a$10$RoBGgDhO9IxgDsNHLywPFuOCy5WfZPE9fHI/TaAx7o/mZIjo06FP2','STUDENT'),(38,'Arjun Nair','arjun.nair@example.com','$2a$10$l6WCFwyPyz70dIPvoaafK.8Gfpsvp6cZkkkTKs4ErA5Q.YoHUywEi','TEACHER'),(41,'akash','akash@gmail.com','$2a$10$qXbc4mDS71mSWeQ26FxqoOPJAG9hVuGqDnzmru.vPUoCQQK1HHdgG','TEACHER'),(42,'pravin','pravin@gmail.com','$2a$10$fRbzGEvulaZgGMzhZyAVRuDy4T74/MxCvOG7Nrbx1DEwFCj1PwAEK','STUDENT'),(43,'aditya','aditya@gmail.com','$2a$10$.fCQc2nvxXnvvBCydZqg6eQ/WLSrvzH9a.6aDmy9Dvhi.B.mlGjq.','STUDENT'),(44,'AdityaT','adityat@gmail.com','$2a$10$e7mwwzTsCgVXNxbhBydMguTfL.lwEo9kao39k6RFHMQnZvGrCggQK','STUDENT');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_settings`
--

DROP TABLE IF EXISTS `user_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_settings` (
  `settings_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `language` varchar(10) DEFAULT 'en',
  `timezone` varchar(50) DEFAULT 'UTC',
  `theme_preference` varchar(20) DEFAULT 'light',
  `email_notifications_enabled` tinyint(1) DEFAULT '1',
  `push_notifications_enabled` tinyint(1) DEFAULT '1',
  `marketing_emails_enabled` tinyint(1) DEFAULT '0',
  `course_updates_enabled` tinyint(1) DEFAULT '1',
  `discussion_replies_enabled` tinyint(1) DEFAULT '1',
  `profile_visibility` varchar(20) DEFAULT 'public',
  `show_online_status` tinyint(1) DEFAULT '1',
  `allow_messages_from` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`settings_id`),
  UNIQUE KEY `unique_user_settings` (`user_id`),
  CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_settings`
--

LOCK TABLES `user_settings` WRITE;
/*!40000 ALTER TABLE `user_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `wishlist_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wishlist_id`),
  UNIQUE KEY `unique_wishlist` (`student_id`,`course_id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_course` (`course_id`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'OnlineCoachingInstitute'
--

--
-- Dumping routines for database 'OnlineCoachingInstitute'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-10 22:32:27
