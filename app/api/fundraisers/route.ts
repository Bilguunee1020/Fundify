import connectToDatabase from '@/lib/mongodb';
import Fundraiser from '@/lib/models/Fundraiser';
import ApprovalRequest from '@/lib/models/ApprovalRequest';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const creator = searchParams.get('creator');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');

    let query: any = {};

    // If creator is specified, show all their fundraisers (for my-fundraisers page)
    // Otherwise, only show active fundraisers (for public listing)
    if (creator) {
      query.creator = creator;
    } else {
      query.status = 'active'; // Only show active fundraisers on public pages
    }

    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const fundraisers = await Fundraiser.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Fundraiser.countDocuments(query);

    return NextResponse.json({ fundraisers, total });
  } catch (error) {
    console.error('Error fetching fundraisers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { title, description, goal, category, image, forWhom, creator, userEmail, firstName, lastName } = body;

    // Validate required fields
    if (!title || !description || !goal || !category || !forWhom || !creator || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate title length (model requires minlength: 5)
    if (title.length < 5) {
      return NextResponse.json({ error: 'Title must be at least 5 characters' }, { status: 400 });
    }

    // Validate description length (model requires minlength: 20)
    if (description.length < 20) {
      return NextResponse.json({ error: 'Description must be at least 20 characters' }, { status: 400 });
    }

    // Get or create user details
    let user = await User.findOne({ clerkId: creator });
    if (!user) {
      // User doesn't exist, create them
      user = new User({
        clerkId: creator,
        email: userEmail,
        firstName: firstName || 'Unknown',
        lastName: lastName || 'User',
      });
      await user.save();
    }

    // Create new fundraiser with pending status
    const fundraiser = new Fundraiser({
      title,
      description,
      goal,
      category,
      image,
      forWhom,
      creator,
      status: 'pending',
    });

    await fundraiser.save();

    // Create approval request
    const approvalRequest = new ApprovalRequest({
      type: 'fundraiser',
      userId: creator,
      userEmail: userEmail,
      fundraiserId: fundraiser._id.toString(),
      reason: `New fundraiser: ${title}`,
    });

    await approvalRequest.save();

    return NextResponse.json({ 
      message: 'Fundraiser submitted for approval', 
      fundraiser,
      approvalRequest 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating fundraiser:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: validationErrors[0] || 'Validation error', details: validationErrors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
