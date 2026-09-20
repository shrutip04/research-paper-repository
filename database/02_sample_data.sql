-- ============================================================
-- ResearchSphere
-- Sample Data
-- PostgreSQL 18
-- ============================================================


-- ============================================================
-- 1. USERS
-- ============================================================

INSERT INTO users
(name, email, password_hash, role)
VALUES
('Shruti Patil', 'shruti@researchsphere.com', 'demo_hash_001', 'ADMIN'),
('Aarav Sharma', 'aarav@researchsphere.com', 'demo_hash_002', 'RESEARCHER'),
('Isha Mehta', 'isha@researchsphere.com', 'demo_hash_003', 'STUDENT'),
('Rohan Kulkarni', 'rohan@researchsphere.com', 'demo_hash_004', 'RESEARCHER'),
('Ananya Rao', 'ananya@researchsphere.com', 'demo_hash_005', 'FACULTY'),
('Karan Shah', 'karan@researchsphere.com', 'demo_hash_006', 'STUDENT'),
('Meera Joshi', 'meera@researchsphere.com', 'demo_hash_007', 'RESEARCHER'),
('Vedant Deshmukh', 'vedant@researchsphere.com', 'demo_hash_008', 'STUDENT'),
('Nisha Kapoor', 'nisha@researchsphere.com', 'demo_hash_009', 'FACULTY'),
('Aditya Nair', 'aditya@researchsphere.com', 'demo_hash_010', 'RESEARCHER');


-- ============================================================
-- 2. AUTHORS
-- ============================================================

INSERT INTO authors
(name, email, affiliation, department, bio)
VALUES
(
    'Ananya Rao',
    'ananya.rao@university.edu',
    'University of Mumbai',
    'Computer Engineering',
    'Researcher working in artificial intelligence and computer vision.'
),
(
    'Rahul Mehta',
    'rahul.mehta@iitm.edu',
    'IIT Mumbai',
    'Computer Science',
    'Researcher focusing on machine learning and deep learning.'
),
(
    'Priya Shah',
    'priya.shah@tech.edu',
    'Tech University',
    'Information Technology',
    'Works on natural language processing and intelligent systems.'
),
(
    'Arjun Desai',
    'arjun.desai@university.edu',
    'University of Mumbai',
    'Computer Engineering',
    'Researcher in distributed systems and cloud computing.'
),
(
    'Neha Kulkarni',
    'neha.kulkarni@iitp.edu',
    'IIT Pune',
    'Computer Science',
    'Researcher specializing in cybersecurity and network security.'
),
(
    'Vikram Joshi',
    'vikram.joshi@research.edu',
    'Research Institute of Technology',
    'Artificial Intelligence',
    'Researcher working on explainable AI and trustworthy machine learning.'
),
(
    'Sneha Iyer',
    'sneha.iyer@university.edu',
    'University of Mumbai',
    'Data Science',
    'Researcher interested in data mining and predictive analytics.'
),
(
    'Aditya Nair',
    'aditya.nair@tech.edu',
    'Tech University',
    'Computer Science',
    'Works on blockchain and distributed ledger technologies.'
),
(
    'Kavya Menon',
    'kavya.menon@iitd.edu',
    'IIT Delhi',
    'Computer Science',
    'Researcher focusing on natural language processing.'
),
(
    'Rohan Kulkarni',
    'rohan.kulkarni@university.edu',
    'University of Mumbai',
    'Computer Engineering',
    'Researcher in cloud infrastructure and distributed systems.'
),
(
    'Meera Joshi',
    'meera.joshi@research.edu',
    'Research Institute of Technology',
    'Data Science',
    'Researcher studying data analytics and machine learning.'
),
(
    'Karan Shah',
    'karan.shah@tech.edu',
    'Tech University',
    'Cybersecurity',
    'Researcher working on secure networks and privacy.'
),
(
    'Nisha Kapoor',
    'nisha.kapoor@iitm.edu',
    'IIT Mumbai',
    'Artificial Intelligence',
    'Faculty researcher in AI and intelligent systems.'
),
(
    'Vedant Deshmukh',
    'vedant.deshmukh@university.edu',
    'University of Mumbai',
    'Computer Engineering',
    'Researcher interested in IoT and edge computing.'
),
(
    'Isha Mehta',
    'isha.mehta@research.edu',
    'Research Institute of Technology',
    'Computer Science',
    'Researcher focusing on human-computer interaction.'
);


-- ============================================================
-- 3. RESEARCH AREAS
-- ============================================================

INSERT INTO research_areas
(area_name, description)
VALUES
(
    'Artificial Intelligence',
    'Research involving intelligent systems, reasoning and AI techniques.'
),
(
    'Machine Learning',
    'Algorithms and statistical methods for learning from data.'
),
(
    'Computer Vision',
    'Analysis and understanding of images and visual information.'
),
(
    'Natural Language Processing',
    'Computational processing and understanding of human language.'
),
(
    'Cybersecurity',
    'Protection of systems, networks and data from security threats.'
),
(
    'Cloud Computing',
    'Distributed computing, cloud infrastructure and scalable services.'
),
(
    'Data Science',
    'Data analysis, mining, visualization and predictive modeling.'
),
(
    'Blockchain',
    'Distributed ledger technologies and decentralized applications.'
);


-- ============================================================
-- 4. PUBLICATION VENUES
-- ============================================================

INSERT INTO publication_venues
(name, venue_type, publisher, issn)
VALUES
(
    'International Journal of Artificial Intelligence Research',
    'JOURNAL',
    'TechScience Publishing',
    '2456-1001'
),
(
    'IEEE Conference on Machine Learning',
    'CONFERENCE',
    'IEEE',
    '2765-2002'
),
(
    'International Conference on Computer Vision',
    'CONFERENCE',
    'ACM',
    '2765-3003'
),
(
    'Journal of Cybersecurity and Privacy',
    'JOURNAL',
    'SecureTech Press',
    '2456-4004'
),
(
    'Cloud Computing Systems Workshop',
    'WORKSHOP',
    'Cloud Research Group',
    '2765-5005'
),
(
    'Data Science and Analytics Symposium',
    'SYMPOSIUM',
    'Data Research Society',
    '2456-6006'
),
(
    'International NLP Conference',
    'CONFERENCE',
    'ACL',
    '2765-7007'
),
(
    'Blockchain Technology Journal',
    'JOURNAL',
    'Distributed Systems Press',
    '2456-8008'
);


-- ============================================================
-- 5. KEYWORDS
-- ============================================================

INSERT INTO keywords
(keyword_name)
VALUES
('Artificial Intelligence'),
('Machine Learning'),
('Deep Learning'),
('Neural Networks'),
('Computer Vision'),
('Natural Language Processing'),
('Transformers'),
('Cybersecurity'),
('Network Security'),
('Cloud Computing'),
('Distributed Systems'),
('Data Mining'),
('Predictive Analytics'),
('Blockchain'),
('Smart Contracts'),
('IoT'),
('Edge Computing'),
('Explainable AI'),
('Privacy'),
('Human Computer Interaction');


-- ============================================================
-- 6. PAPERS
-- ============================================================

INSERT INTO papers
(
    title,
    abstract,
    publication_year,
    doi,
    paper_type,
    file_url,
    area_id,
    venue_id,
    uploaded_by
)
VALUES

(
    'Deep Learning for Medical Image Analysis',
    'A study of deep learning techniques for detecting patterns in medical images.',
    2024,
    '10.1000/rs.2024.001',
    'RESEARCH',
    'https://example.com/papers/medical-image-analysis.pdf',
    3,
    3,
    5
),

(
    'Explainable Artificial Intelligence for Healthcare',
    'An investigation into interpretable machine learning techniques for healthcare applications.',
    2023,
    '10.1000/rs.2023.002',
    'RESEARCH',
    'https://example.com/papers/xai-healthcare.pdf',
    1,
    1,
    5
),

(
    'Transformer Models for Natural Language Understanding',
    'A comparative study of transformer architectures for language understanding tasks.',
    2024,
    '10.1000/rs.2024.003',
    'RESEARCH',
    'https://example.com/papers/transformers-nlp.pdf',
    4,
    7,
    2
),

(
    'A Survey of Machine Learning Algorithms',
    'A comprehensive survey of supervised, unsupervised and reinforcement learning algorithms.',
    2022,
    '10.1000/rs.2022.004',
    'SURVEY',
    'https://example.com/papers/ml-survey.pdf',
    2,
    1,
    4
),

(
    'Secure Communication in IoT Networks',
    'Security mechanisms for protecting communication between resource-constrained IoT devices.',
    2023,
    '10.1000/rs.2023.005',
    'RESEARCH',
    'https://example.com/papers/iot-security.pdf',
    5,
    4,
    9
),

(
    'Scalable Cloud Computing Architecture',
    'An architecture for building scalable and fault-tolerant cloud applications.',
    2021,
    '10.1000/rs.2021.006',
    'RESEARCH',
    'https://example.com/papers/cloud-architecture.pdf',
    6,
    5,
    4
),

(
    'Data Mining Techniques for Student Performance Prediction',
    'Application of data mining techniques for predicting student academic performance.',
    2024,
    '10.1000/rs.2024.007',
    'CASE_STUDY',
    'https://example.com/papers/student-performance.pdf',
    7,
    6,
    7
),

(
    'Blockchain-Based Academic Credential Verification',
    'A blockchain framework for secure and tamper-resistant academic credential verification.',
    2023,
    '10.1000/rs.2023.008',
    'RESEARCH',
    'https://example.com/papers/blockchain-credentials.pdf',
    8,
    8,
    10
),

(
    'Privacy Preserving Machine Learning',
    'Techniques for protecting sensitive information during machine learning model training.',
    2024,
    '10.1000/rs.2024.009',
    'RESEARCH',
    'https://example.com/papers/privacy-ml.pdf',
    2,
    2,
    2
),

(
    'Edge Computing for Smart Cities',
    'A study of edge computing architectures for low-latency smart city applications.',
    2022,
    '10.1000/rs.2022.010',
    'RESEARCH',
    'https://example.com/papers/edge-smart-city.pdf',
    6,
    5,
    8
),

(
    'Human Computer Interaction in Educational Platforms',
    'Analysis of user interaction patterns in digital education platforms.',
    2023,
    '10.1000/rs.2023.011',
    'RESEARCH',
    'https://example.com/papers/hci-education.pdf',
    1,
    1,
    3
),

(
    'Network Intrusion Detection Using Machine Learning',
    'Machine learning approaches for identifying malicious network traffic.',
    2024,
    '10.1000/rs.2024.012',
    'RESEARCH',
    'https://example.com/papers/network-intrusion.pdf',
    5,
    4,
    9
),

(
    'Predictive Analytics for Healthcare Data',
    'Predictive modeling techniques for discovering patterns in healthcare datasets.',
    2021,
    '10.1000/rs.2021.013',
    'RESEARCH',
    'https://example.com/papers/healthcare-analytics.pdf',
    7,
    6,
    7
),

(
    'Smart Contracts for Decentralized Applications',
    'Analysis of smart contract architectures for decentralized applications.',
    2022,
    '10.1000/rs.2022.014',
    'RESEARCH',
    'https://example.com/papers/smart-contracts.pdf',
    8,
    8,
    10
),

(
    'Deep Neural Networks for Image Classification',
    'Evaluation of deep neural network architectures for image classification.',
    2020,
    '10.1000/rs.2020.015',
    'RESEARCH',
    'https://example.com/papers/image-classification.pdf',
    3,
    3,
    5
),

(
    'Distributed Systems for Large Scale Applications',
    'Design principles for reliable distributed applications operating at large scale.',
    2023,
    '10.1000/rs.2023.016',
    'RESEARCH',
    'https://example.com/papers/distributed-systems.pdf',
    6,
    5,
    4
),

(
    'Natural Language Processing for Academic Search',
    'NLP techniques for improving search and discovery of academic publications.',
    2024,
    '10.1000/rs.2024.017',
    'RESEARCH',
    'https://example.com/papers/nlp-academic-search.pdf',
    4,
    7,
    2
),

(
    'Explainable Deep Learning Models',
    'Methods for improving the interpretability of deep learning models.',
    2023,
    '10.1000/rs.2023.018',
    'RESEARCH',
    'https://example.com/papers/explainable-deep-learning.pdf',
    1,
    2,
    6
),

(
    'IoT Edge Analytics for Smart Infrastructure',
    'Combining IoT sensors and edge analytics for intelligent infrastructure.',
    2024,
    '10.1000/rs.2024.019',
    'RESEARCH',
    'https://example.com/papers/iot-edge-analytics.pdf',
    6,
    5,
    8
),

(
    'A Review of Blockchain Security Mechanisms',
    'A review of security mechanisms used in modern blockchain systems.',
    2021,
    '10.1000/rs.2021.020',
    'REVIEW',
    'https://example.com/papers/blockchain-security.pdf',
    8,
    8,
    10
);


-- ============================================================
-- 7. PAPER_AUTHORS
-- ============================================================

INSERT INTO paper_authors
(paper_id, author_id, author_order)
VALUES

(1, 1, 1),
(1, 2, 2),
(1, 6, 3),

(2, 1, 1),
(2, 6, 2),
(2, 13, 3),

(3, 3, 1),
(3, 9, 2),

(4, 2, 1),
(4, 7, 2),
(4, 11, 3),

(5, 5, 1),
(5, 12, 2),

(6, 4, 1),
(6, 10, 2),

(7, 7, 1),
(7, 11, 2),

(8, 8, 1),
(8, 13, 2),

(9, 2, 1),
(9, 6, 2),

(10, 14, 1),
(10, 10, 2),

(11, 15, 1),
(11, 3, 2),

(12, 5, 1),
(12, 2, 2),

(13, 7, 1),
(13, 11, 2),

(14, 8, 1),
(14, 13, 2),

(15, 1, 1),
(15, 2, 2),

(16, 4, 1),
(16, 10, 2),
(16, 14, 3),

(17, 3, 1),
(17, 9, 2),
(17, 15, 3),

(18, 6, 1),
(18, 13, 2),

(19, 14, 1),
(19, 8, 2),

(20, 8, 1),
(20, 5, 2);


-- ============================================================
-- 8. PAPER_KEYWORDS
-- ============================================================

INSERT INTO paper_keywords
(paper_id, keyword_id)
VALUES

(1, 3),
(1, 4),
(1, 5),

(2, 1),
(2, 3),
(2, 18),

(3, 6),
(3, 7),
(3, 2),

(4, 2),
(4, 3),
(4, 4),

(5, 8),
(5, 9),
(5, 16),

(6, 10),
(6, 11),

(7, 12),
(7, 13),
(7, 2),

(8, 14),
(8, 15),
(8, 19),

(9, 2),
(9, 19),
(9, 8),

(10, 16),
(10, 17),
(10, 10),

(11, 20),
(11, 6),

(12, 8),
(12, 9),
(12, 2),

(13, 13),
(13, 12),
(13, 2),

(14, 14),
(14, 15),
(14, 19),

(15, 3),
(15, 4),
(15, 5),

(16, 11),
(16, 10),

(17, 6),
(17, 7),
(17, 20),

(18, 18),
(18, 3),
(18, 4),

(19, 16),
(19, 17),
(19, 10),

(20, 14),
(20, 19),
(20, 8);


-- ============================================================
-- 9. CITATIONS
-- ============================================================

INSERT INTO citations
(citing_paper_id, cited_paper_id, citation_context)
VALUES

(1, 15, 'Builds upon deep neural network approaches for image classification.'),
(1, 4, 'Uses machine learning concepts discussed in the survey.'),

(2, 1, 'Uses deep learning techniques for healthcare applications.'),
(2, 18, 'Extends explainability techniques for deep learning.'),

(3, 4, 'Compares transformer models with traditional machine learning approaches.'),
(3, 17, 'Builds upon NLP approaches for academic search.'),

(5, 12, 'Uses machine learning approaches for network security.'),
(5, 10, 'Considers edge computing for IoT environments.'),

(6, 16, 'Extends distributed systems concepts for cloud applications.'),
(6, 10, 'Uses edge computing concepts for scalable architectures.'),

(7, 4, 'Uses machine learning algorithms from the survey.'),
(7, 13, 'Builds upon predictive analytics techniques.'),

(8, 14, 'Uses smart contract mechanisms for credential verification.'),
(8, 20, 'Addresses security mechanisms in blockchain systems.'),

(9, 4, 'Uses machine learning concepts from the survey.'),
(9, 2, 'Discusses privacy concerns in intelligent systems.'),

(10, 6, 'Uses cloud computing concepts for smart infrastructure.'),
(10, 19, 'Extends edge computing approaches.'),

(11, 17, 'Uses NLP techniques for academic search.'),
(11, 3, 'Applies language understanding techniques.'),

(12, 5, 'Extends network security approaches.'),
(12, 9, 'Uses machine learning for intrusion detection.'),

(13, 7, 'Builds upon predictive modeling techniques.'),
(13, 4, 'Uses machine learning algorithms.'),

(14, 20, 'Uses blockchain security mechanisms.'),
(14, 8, 'Builds upon blockchain credential systems.'),

(15, 1, 'Provides earlier image analysis approaches.'),
(15, 4, 'Uses concepts from machine learning research.'),

(16, 6, 'Extends cloud distributed architecture concepts.'),
(16, 10, 'Uses edge computing principles.'),

(17, 3, 'Extends NLP techniques for academic discovery.'),
(17, 11, 'Uses human-computer interaction concepts.'),

(18, 2, 'Extends explainable AI techniques.'),
(18, 15, 'Applies explainability to deep learning.'),

(19, 10, 'Combines IoT and edge computing concepts.'),
(19, 5, 'Uses secure IoT communication mechanisms.'),

(20, 8, 'Analyzes security mechanisms used in blockchain systems.'),
(20, 14, 'Reviews smart contract security concerns.');


-- ============================================================
-- 10. REVIEWS
-- ============================================================

INSERT INTO reviews
(user_id, paper_id, rating, comment)
VALUES

(3, 1, 5, 'Very useful introduction to medical image analysis.'),
(6, 1, 4, 'Good explanation of deep learning methods.'),

(3, 2, 5, 'Excellent discussion of explainable AI.'),
(8, 2, 4, 'Useful for understanding interpretable models.'),

(4, 3, 5, 'Strong comparison of transformer architectures.'),

(6, 4, 4, 'Good survey for beginners in machine learning.'),
(8, 4, 5, 'Comprehensive overview of ML algorithms.'),

(3, 5, 4, 'Interesting work on IoT security.'),
(6, 5, 5, 'Practical security perspective.'),

(7, 6, 4, 'Clear discussion of scalable cloud systems.'),

(3, 7, 5, 'Useful example of predictive analytics.'),
(8, 7, 4, 'Interesting application of data mining.'),

(6, 8, 5, 'Good blockchain application.'),

(3, 9, 5, 'Important privacy considerations.'),
(7, 9, 4, 'Useful overview of privacy preserving ML.'),

(8, 10, 4, 'Interesting smart city application.'),

(3, 11, 5, 'Relevant to educational technology.'),

(6, 12, 5, 'Good cybersecurity application of machine learning.'),

(7, 13, 4, 'Useful healthcare analytics study.'),

(8, 20, 4, 'Good overview of blockchain security.');


-- ============================================================
-- 11. BOOKMARKS
-- ============================================================

INSERT INTO bookmarks
(user_id, paper_id)
VALUES

(3, 1),
(3, 2),
(3, 3),
(3, 9),

(6, 1),
(6, 4),
(6, 5),
(6, 12),

(7, 6),
(7, 7),
(7, 13),

(8, 2),
(8, 8),
(8, 10),
(8, 20),

(4, 3),
(4, 17),
(4, 11),

(9, 5),
(9, 12);


-- ============================================================
-- 12. DOWNLOADS
-- ============================================================

INSERT INTO downloads
(user_id, paper_id)
VALUES

(3, 1),
(3, 1),
(3, 2),
(3, 3),
(3, 4),

(4, 1),
(4, 3),
(4, 6),
(4, 17),

(5, 1),
(5, 2),
(5, 7),
(5, 13),

(6, 4),
(6, 5),
(6, 5),
(6, 8),
(6, 12),

(7, 7),
(7, 9),
(7, 13),
(7, 18),

(8, 2),
(8, 3),
(8, 8),
(8, 10),
(8, 20),

(9, 5),
(9, 12),
(9, 14),

(10, 6),
(10, 10),
(10, 16),
(10, 19),

(2, 1),
(2, 4),
(2, 9),
(2, 17);