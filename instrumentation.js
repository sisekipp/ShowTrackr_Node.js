export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    import('./lib/agenda')
      .then(({ getAgenda }) => getAgenda())
      .catch((err) => {
        console.error('Agenda scheduler failed to start:', err.message);
      });
  }
}
