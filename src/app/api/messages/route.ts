import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import  authOptions  from "../auth/[...nextauth]/option";
import connectDB from "../db/connect";
import UserMessage from "../model/user-message";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { message } = await req.json();

    await connectDB();

    const newMessage = await UserMessage.create({
      message,
      email: session.user.email,
    });

    return NextResponse.json(
      { message: "Message sent successfully", data: newMessage },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error in message route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
