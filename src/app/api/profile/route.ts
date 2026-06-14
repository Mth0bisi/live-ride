import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

/**
 * GET /api/profile
 * Returns the currently authenticated user's details.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const uid = cookieStore.get('lr_uid')?.value;

    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        viewerPackage: true,
        subscriptionStatus: true,
        subscriptionEndsAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('GET /api/profile error:', err);
    return NextResponse.json({ error: 'Failed to retrieve profile data.' }, { status: 500 });
  }
}

/**
 * PUT /api/profile
 * Updates the user's name, email, and password.
 */
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const uid = cookieStore.get('lr_uid')?.value;

    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;

    // Validate name and email inputs
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    const cleanedEmail = email.toLowerCase().trim();

    // Check if email conflicts with another user
    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email: cleanedEmail },
    });

    if (existingUserWithEmail && existingUserWithEmail.id !== uid) {
      return NextResponse.json({ error: 'Email address is already in use.' }, { status: 400 });
    }

    // Fetch current database state to check password if needed
    const currentUser = await prisma.user.findUnique({
      where: { id: uid },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const updateData: {
      name: string;
      email: string;
      passwordHash?: string;
    } = {
      name: name.trim(),
      email: cleanedEmail,
    };

    // If changing password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password.' }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters long.' }, { status: 400 });
      }

      // Check current password correctness
      if (currentUser.passwordHash) {
        const isMatch = await bcrypt.compare(currentPassword, currentUser.passwordHash);
        if (!isMatch) {
          return NextResponse.json({ error: 'Incorrect current password.' }, { status: 400 });
        }
      }

      // Hash and set new password
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Save changes
    const updatedUser = await prisma.user.update({
      where: { id: uid },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        viewerPackage: true,
        subscriptionStatus: true,
      },
    });

    // Update name cookie dynamically so the navigation header syncs immediately
    const cookieOpts = {
      httpOnly: true,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
    };
    cookieStore.set('lr_name', updatedUser.name, cookieOpts);

    return NextResponse.json({
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (err) {
    console.error('PUT /api/profile error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
