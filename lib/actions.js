'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Show from '@/lib/models/Show';
import { addShowFromTvdb } from '@/lib/tvdb';
import { nextAiring } from '@/lib/airdate';
import { getAgenda } from '@/lib/agenda';

export async function login(formData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const result = await signIn('credentials', { email, password, redirect: false });
  if (!result || result.error) {
    redirect('/login?error=' + encodeURIComponent('Invalid email or password.'));
  }
  redirect('/');
}

export async function logout() {
  await signOut({ redirectTo: '/' });
}

export async function signup(formData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  if (!email || !password) {
    redirect('/signup?error=' + encodeURIComponent('Email and password are required.'));
  }
  await connectDB();
  const existing = await User.findOne({ email });
  if (existing) {
    redirect('/signup?error=' + encodeURIComponent('This email is already registered.'));
  }
  await User.create({ email, password });
  redirect('/login?message=' + encodeURIComponent('Account created. You can log in now.'));
}

export async function addShow(formData) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const showName = String(formData.get('showName') || '').trim();
  if (!showName) {
    redirect('/add?error=' + encodeURIComponent('Please enter a show name.'));
  }
  let showData;
  try {
    showData = await addShowFromTvdb(showName);
  } catch (err) {
    redirect('/add?error=' + encodeURIComponent('TVDB request failed: ' + err.message));
  }
  if (!showData) {
    redirect('/add?error=' + encodeURIComponent(`"${showName}" was not found on TVDB.`));
  }
  await connectDB();
  const existing = await Show.findById(showData._id);
  if (existing) {
    redirect('/add?error=' + encodeURIComponent(`${showData.name} already exists.`));
  }
  const show = await Show.create(showData);
  const alertDate = nextAiring(show.airsDayOfWeek, show.airsTime);
  if (alertDate) {
    const agenda = await getAgenda();
    const job = await agenda.schedule(alertDate, 'send email alert', show.name);
    job.repeatEvery('1 week');
    await job.save();
  }
  revalidatePath('/');
  redirect(`/shows/${show._id}`);
}

export async function subscribe(showId) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  await connectDB();
  const show = await Show.findById(showId);
  if (!show) redirect('/');
  if (!show.subscribers.some((id) => id.toString() === session.user.id)) {
    show.subscribers.push(session.user.id);
    await show.save();
  }
  revalidatePath(`/shows/${showId}`);
}

export async function unsubscribe(showId) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  await connectDB();
  const show = await Show.findById(showId);
  if (!show) redirect('/');
  show.subscribers = show.subscribers.filter((id) => id.toString() !== session.user.id);
  await show.save();
  revalidatePath(`/shows/${showId}`);
}
