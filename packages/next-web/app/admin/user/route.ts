import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '../../../../next/services/DatabaseService';
import { getServerSession } from '../../../../next/client/controllers/UserController';

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return new Response('No Soup for You!', { status: 401 });
  }
  
  const users = await DatabaseService.user.findMany();
  return new Response('Hello, World!', { status: 200 });
//   return NextResponse.json(users);
}

// export async function POST(request: NextRequest) {
//   const session = await getServerSession();
//   if (!session) {
//     return new Response('No Soup for You!', { status: 401 });
//   }
//   const body = await request.json();
//   const newUser = await DatabaseService.user.create({ data: body });
//   return NextResponse.json(newUser, { status: 201 });
// }

// export async function PATCH(request: NextRequest) {
//   const session = await getServerSession();
//   if (!session) {
//     return new Response('No Soup for You!', { status: 401 });
//   }
//   const { id, ...data } = await request.json();
//   const updatedUser = await DatabaseService.user.update({
//     where: { id },
//     data,
//   });
//   return NextResponse.json(updatedUser);
// }

// export async function DELETE(request: NextRequest) {
//   const session = await getServerSession();
//   if (!session) {
//     return new Response('No Soup for You!', { status: 401 });
//   }
//   const { id } = await request.json();
//   await DatabaseService.user.delete({ where: { id } });
//   return NextResponse.json({ message: 'User deleted' });
// }