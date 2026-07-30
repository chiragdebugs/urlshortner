import { NextResponse } from 'next/server';

export async function GET() {
  return new Response('google-site-verification: google7b1106714ce750b3.html', {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
