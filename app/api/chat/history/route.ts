import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { chatMessages, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // 1. Authenticate user
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get database user
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Fetch chat history (ordered by time)
    const history = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, dbUser.id))
      .orderBy(chatMessages.createdAt);

    return NextResponse.json({ messages: history }, { status: 200 });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}
