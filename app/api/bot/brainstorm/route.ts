import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/db';
import { chatMessages, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
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

    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // 3. Save user message to database
    await db.insert(chatMessages).values({
      userId: dbUser.id,
      role: 'user',
      content: message,
    });

    // 4. Fetch recent chat history from database (last 12 messages = 6 pairs)
    const recentMessages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, dbUser.id))
      .orderBy(chatMessages.createdAt)
      .limit(12);

    // 5. Build conversation context
    const systemPrompt = `You are a production cost brainstorming assistant for film/TV production.

RULES:
- Help users think through cost trade-offs and optimization strategies
- Provide qualitative advice only (NO budgets, NO currency, NO numeric costs)
- Suggest ways to reduce production expenses
- Explain trade-offs between different approaches
- Be conversational and helpful
- Base suggestions on production best practices
- Ask clarifying questions to guide users

TOPICS YOU CAN DISCUSS:
- Crew size optimization
- Location vs studio trade-offs
- VFX vs practical effects
- Schedule efficiency
- Resource allocation
- Vendor negotiations
- Equipment rental strategies
- Talent management
- Permit and insurance considerations

WHAT YOU CANNOT DO:
- Calculate specific budgets or costs
- Access or modify database
- Make decisions for the user
- Provide legal or financial advice
- Guarantee cost savings

Keep responses concise (2-4 paragraphs) and actionable.`;

    // Build chat history for Gemini (exclude the current message we just saved)
    let chatHistory = recentMessages
      .filter(msg => msg.content !== message) // Exclude current message
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));
    
    // Filter out any leading assistant messages to ensure first message is from user
    // Gemini requires first message in history to have role 'user'
    while (chatHistory.length > 0 && chatHistory[0].role === 'assistant') {
      chatHistory = chatHistory.slice(1);
    }
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      systemInstruction: systemPrompt
    });

    const chat = model.startChat({
      history: chatHistory.map((msg: ConversationMessage) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    // 6. Save assistant response to database
    await db.insert(chatMessages).values({
      userId: dbUser.id,
      role: 'assistant',
      content: response,
    });

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error('Brainstorm bot error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
