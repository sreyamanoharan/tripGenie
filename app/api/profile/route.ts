import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

 const {
  name,
  mobileNumber,
  profilePicture,
} = await req.json();

const user =await prisma.user.update({
  where: {
    email: session.user.email,
  },
  data: {
    name,
    mobileNumber,
    profilePicture,
  },
});

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

