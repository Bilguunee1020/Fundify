const mongoose = require('mongoose');

async function addSampleFundraisers() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fundify');
    console.log('Connected to MongoDB');

    // Get the database connection
    const db = mongoose.connection.db;

    // Create a sample user if it doesn't exist
    const usersCollection = db.collection('users');
    let user = await usersCollection.findOne({ email: 'sample@example.com' });
    if (!user) {
      user = {
        clerkId: 'sample-user-123',
        email: 'sample@example.com',
        firstName: 'Sample',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await usersCollection.insertOne(user);
      console.log('Created sample user');
    }

    // Sample fundraisers data
    const sampleFundraisers = [
      {
        title: "Help Maria Recover from Surgery",
        description: "Maria needs help covering medical expenses after her unexpected surgery. She's a single mother of two and has been unable to work during her recovery.",
        goal: 5000,
        category: "medical",
        image: "/images/emergency.svg",
        forWhom: "myself",
        creator: user.clerkId,
        raised: 1250,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Support Local Animal Shelter",
        description: "Our local animal shelter needs funds to expand their facilities and care for more abandoned animals in our community.",
        goal: 10000,
        category: "animals",
        image: "/images/animal.svg",
        forWhom: "someone_else",
        creator: user.clerkId,
        raised: 3500,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Education for Underprivileged Children",
        description: "Help provide school supplies, books, and educational materials for children in rural areas who lack access to quality education.",
        goal: 3000,
        category: "education",
        image: "/images/education.svg",
        forWhom: "someone_else",
        creator: user.clerkId,
        raised: 850,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Small Business Recovery Fund",
        description: "Help local small businesses recover from economic challenges by providing grants and support to keep their doors open.",
        goal: 15000,
        category: "business",
        image: "/images/business.svg",
        forWhom: "someone_else",
        creator: user.clerkId,
        raised: 6200,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Emergency Relief for Flood Victims",
        description: "Provide immediate assistance to families affected by recent flooding, including food, shelter, and essential supplies.",
        goal: 20000,
        category: "emergency",
        image: "/images/emergency.svg",
        forWhom: "someone_else",
        creator: user.clerkId,
        raised: 8750,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Get the fundraisers collection
    const fundraisersCollection = db.collection('fundraisers');

    // Delete existing sample fundraisers
    await fundraisersCollection.deleteMany({ creator: user.clerkId });
    console.log('Cleared existing sample fundraisers');

    // Add new sample fundraisers
    await fundraisersCollection.insertMany(sampleFundraisers);
    console.log('Created 5 sample fundraisers');

    console.log('Successfully added sample fundraisers!');
    console.log('The "Discover Fundraisers" section should now be visible on your homepage.');

  } catch (error) {
    console.error('Error adding sample fundraisers:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addSampleFundraisers();