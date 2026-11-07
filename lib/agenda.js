import { Agenda } from 'agenda';
import { MongoBackend } from '@agendajs/mongo-backend';
import nodemailer from 'nodemailer';
import connectDB from '@/lib/mongodb';
import Show from '@/lib/models/Show';

async function createAgenda() {
  const agenda = new Agenda({
    backend: new MongoBackend({
      address: process.env.MONGODB_URI,
      collection: 'agendaJobs',
    }),
  });

  agenda.define('send email alert', async (job) => {
    await connectDB();
    const show = await Show.findOne({ name: job.attrs.data }).populate('subscribers');
    if (!show) return;
    const emails = show.subscribers.map((user) => user.email);
    if (emails.length === 0) return;
    const upcomingEpisode = show.episodes.filter(
      (episode) => new Date(episode.firstAired) > new Date()
    )[0];
    if (!upcomingEpisode) return;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
      port: Number(process.env.SMTP_PORT || 587),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: emails.join(','),
      subject: `${show.name} is starting soon!`,
      text:
        `${show.name} starts in less than 2 hours on ${show.network}.\n\n` +
        `Episode ${upcomingEpisode.episodeNumber} Overview\n\n${upcomingEpisode.overview}`,
    });
  });

  await agenda.start();
  return agenda;
}

export async function getAgenda() {
  if (!global._agendaPromise) {
    global._agendaPromise = createAgenda().catch((err) => {
      global._agendaPromise = null;
      throw err;
    });
  }
  return global._agendaPromise;
}
