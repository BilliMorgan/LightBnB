insert into users VALUES (1,'Givi', 'givi@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
insert into users VALUES (2,'gogi', 'gogi@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
insert into users VALUES (3, 'kakhi', 'kakhi@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

insert into properties VALUES (1, 1, 'dvarets vakh', 'description', 'http:// image.jpeg', 'http://more_images.jpeg', 100.00, 5, 3, 6,'Georgia', 'Kahi_Kaladze', 'Batumi', 'Adjaria', '02232', 'true');
insert into properties VALUES (2, 1, 'dvarets2', 'description', 'http:// image.jpeg', 'http://more_images.jpeg', 500.00,  1, 2, 3,'Georgia', 'Kahi_Kaladze', 'Batumi', 'Adjaria', '02232', 'false');
insert into properties VALUES (3, 3, 'room_for_two', 'description', 'http:// image.jpeg', 'http://more_images.jpeg', 68.99, 0, 1, 1 ,'Canada', 'downtown', 'Toronto', 'Ontario', 'R1R1T5', 'true');

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

insert into property_reviews VALUES (1, 2, 3, 1, 5, 'description');
insert into property_reviews VALUES (2, 1, 3, 1, 5, 'description');
insert into property_reviews VALUES (3, 3, 3, 1, 5, 'description');