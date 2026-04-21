import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import User from "@/models/User";
import connect from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    await connect();

    const { id } = await params;
    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return public fields only (no email, no password)
    const publicUser = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      country: user.country,
      currentLocation: user.currentLocation,
      nomadSince: user.nomadSince,
      skills: user.skills,
      linkedinUrl: user.linkedinUrl,
      githubUrl: user.githubUrl,
      twitterUrl: user.twitterUrl,
      createdAt: user.createdAt,
    };

    // TODO: Fetch submitted spaces count and threads count
    // For now, return mock counts
    const stats = {
      spacesCount: 0,
      threadsCount: 0,
    };

    return NextResponse.json({ ...publicUser, stats });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Only allow users to edit their own profile
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { bio, country, currentLocation, skills, linkedinUrl, githubUrl, twitterUrl } = body;

    await connect();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update allowed fields
    if (bio !== undefined) user.bio = bio;
    if (country !== undefined) user.country = country;
    if (currentLocation !== undefined) user.currentLocation = currentLocation;
    if (skills !== undefined) user.skills = skills;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (twitterUrl !== undefined) user.twitterUrl = twitterUrl;

    await user.save();

    // Return updated public user data
    const publicUser = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      country: user.country,
      currentLocation: user.currentLocation,
      nomadSince: user.nomadSince,
      skills: user.skills,
      linkedinUrl: user.linkedinUrl,
      githubUrl: user.githubUrl,
      twitterUrl: user.twitterUrl,
      createdAt: user.createdAt,
    };

    return NextResponse.json(publicUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
