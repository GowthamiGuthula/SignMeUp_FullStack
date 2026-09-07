const EVENTS_DATA = [
    {
      id: 1,
      name: 'React Workshop',
      date: '2026-05-15',
      time: '10:00 AM - 4:00 PM',
      location: 'Room 101, Tech Campus',
      category: 'Workshop',
      totalSlots: 40,
      slotsBooked: 24,
      description:
        'Learn React fundamentals including components, hooks, and routing. Build a project from scratch in this full-day hands-on workshop.',
      image:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=350&fit=crop',
      attendees: [
        { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', phone: '5551234567' },
        { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', phone: '5552345678' },
        { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', phone: '5553456789' },
        { firstName: 'Diana', lastName: 'Miller', email: 'diana@example.com', phone: '5554567890' },
        { firstName: 'Eve', lastName: 'Davis', email: 'eve@example.com', phone: '5555678901' }
      ],
    },
    {
      id: 2,
      name: 'Team Building Picnic',
      date: '2026-07-01',
      time: '12:00 PM - 5:00 PM',
      location: 'Central Park, Pavilion B',
      category: 'Social',
      totalSlots: 60,
      slotsBooked: 45,
      description:
        'Outdoor team activities, relay races, trivia, volleyball, and a catered lunch with vegetarian options. A great way to bond with colleagues.',
      image:
        'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&h=350&fit=crop',
      attendees: [
        { firstName: 'Frank', lastName: 'Wilson', email: 'frank@example.com', phone: '5556789012' },
        { firstName: 'Grace', lastName: 'Taylor', email: 'grace@example.com', phone: '5557890123' },
        { firstName: 'Heidi', lastName: 'Anderson', email: 'heidi@example.com', phone: '5558901234' }
      ],
    },
    {
      id: 3,
      name: 'Hackathon 2026',
      date: '2026-06-20',
      time: '8:00 AM - 8:00 AM (next day)',
      location: 'Main Hall, Convention Center',
      category: 'Competition',
      totalSlots: 120,
      slotsBooked: 80,
      description:
        '24-hour coding challenge! Build innovative solutions around "Tech for Good." Top 3 teams win cash prizes and interview fast-tracks.',
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=350&fit=crop',
      attendees: [
        { firstName: 'Karl', lastName: 'Garcia', email: 'karl@example.com', phone: '5551234567' },
        { firstName: 'Liam', lastName: 'Hernandez', email: 'liam@example.com', phone: '5552345678' },
        { firstName: 'Mallory', lastName: 'Lopez', email: 'mallory@example.com', phone: '5553456789' },
        { firstName: 'Nancy', lastName: 'Gonzalez', email: 'nancy@example.com', phone: '5554567890' },
        { firstName: 'Oscar', lastName: 'Wilson', email: 'oscar@example.com', phone: '5555678901' },
        { firstName: 'Peggy', lastName: 'Clark', email: 'peggy@example.com', phone: '5556789012' }
      ],
    },
    {
      id: 4,
      name: 'Virtual Reality Expo',
      date: '2026-08-15',
      time: '10:00 AM - 6:00 PM',
      location: 'Expo Hall, Innovation Center',
      category: 'Expo',
      totalSlots: 100,
      slotsBooked: 60,
      description:
        'Explore the latest in VR technology. Demos from leading companies, networking sessions, and hands-on experiences.',
      image:
        'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=600&h=350&fit=crop',
      attendees: [
        { firstName: 'Victor', lastName: 'Lee', email: 'victor@example.com', phone: '5552345678' },
        { firstName: 'Wendy', lastName: 'Moore', email: 'wendy@example.com', phone: '5553456789' },
        { firstName: 'Xavier', lastName: 'Perez', email: 'xavier@example.com', phone: '5554567890' }
      ],
    },
    {
      id: 5,
      name: 'AI Ethics Seminar',
      date: '2026-03-10',
      time: '2:00 PM - 5:00 PM',
      location: 'Auditorium A, Tech Campus',
      category: 'Seminar',
      totalSlots: 50,
      slotsBooked: 30,
      description:
        'Discuss the ethical implications of AI in society, including bias, privacy, and future regulations. Panel discussion with experts.',
      image:
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=350&fit=crop',
      attendees: [
        { firstName: 'Tom', lastName: 'Harris', email: 'tom@example.com', phone: '5550123456' },
        { firstName: 'Uma', lastName: 'King', email: 'uma@example.com', phone: '5551234567' }
      ],
    },
    
    {
      id: 6,
      name: 'Startup Pitch Night',
      date: '2026-09-05',
      time: '6:00 PM - 9:00 PM',
      location: 'Stage Area, Downtown Venue',
      category: 'Networking',
      totalSlots: 80,
      slotsBooked: 50,
      description:
        'Watch emerging startups pitch their ideas to investors. Networking opportunities and Q&A sessions.',
      image:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=350&fit=crop',
      attendees: [
        { firstName: 'Yara', lastName: 'Roberts', email: 'yara@example.com', phone: '5555678901' },
        { firstName: 'Zane', lastName: 'Scott', email: 'zane@example.com', phone: '5556789012' }
      ],
    },
  ]
  
  export default EVENTS_DATA