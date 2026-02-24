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

    // Хэрэв үүсгэгч (creator) тодорхой байвал тухайн хэрэглэгчийн бүх хандивыг харуулна (миний хандив хэсэгт)
    // Бусад тохиолдолд зөвхөн идэвхтэй хандивуудыг харуулна (нийтэд харагдах жагсаалт)
    if (creator) {
      query.creator = creator;
    } else {
      query.status = 'active'; // Нийтийн хуудас дээр зөвхөн идэвхтэй хандивуудыг харуулна
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
    console.error('Хандивын мэдээлэл авахад алдаа гарлаа:', error);
    return NextResponse.json({ error: 'Серверийн дотоод алдаа' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { title, description, goal, category, image, forWhom, creator, userEmail, firstName, lastName } = body;

    // Шаардлагатай талбаруудыг шалгах
    if (!title || !description || !goal || !category || !forWhom || !creator || !userEmail) {
      return NextResponse.json({ error: 'Шаардлагатай талбаруудыг бөглөнө үү' }, { status: 400 });
    }

    // Гарчгийн уртыг шалгах (хамгийн багадаа 5 тэмдэгт)
    if (title.length < 5) {
      return NextResponse.json({ error: 'Гарчиг хамгийн багадаа 5 тэмдэгт байх ёстой' }, { status: 400 });
    }

    // Тайлбарын уртыг шалгах (хамгийн багадаа 20 тэмдэгт)
    if (description.length < 20) {
      return NextResponse.json({ error: 'Тайлбар хамгийн багадаа 20 тэмдэгт байх ёстой' }, { status: 400 });
    }

    // Хэрэглэгчийн мэдээллийг авах эсвэл шинээр үүсгэх
    let user = await User.findOne({ clerkId: creator });
    if (!user) {
      // Хэрэглэгч бүртгэлгүй бол шинээр үүсгэнэ
      user = new User({
        clerkId: creator,
        email: userEmail,
        firstName: firstName || 'Үл мэдэгдэх',
        lastName: lastName || 'Хэрэглэгч',
      });
      await user.save();
    }

    // Хандивыг "хүлээгдэж буй" (pending) төлөвтэйгээр үүсгэх
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

    // Зөвшөөрөл хүсэх хүсэлт (approval request) үүсгэх
    const approvalRequest = new ApprovalRequest({
      type: 'fundraiser',
      userId: creator,
      userEmail: userEmail,
      fundraiserId: fundraiser._id.toString(),
      reason: `Шинэ хандив: ${title}`,
    });

    await approvalRequest.save();

    return NextResponse.json({ 
      message: 'Хандивын хүсэлтийг хянахаар хүлээн авлаа', 
      fundraiser,
      approvalRequest 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Хандив үүсгэхэд алдаа гарлаа:', error);
    
    // Mongoose-ийн баталгаажуулалтын алдааг боловсруулах
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: validationErrors[0] || 'Баталгаажуулалтын алдаа', details: validationErrors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Серверийн дотоод алдаа' }, { status: 500 });
  }
}