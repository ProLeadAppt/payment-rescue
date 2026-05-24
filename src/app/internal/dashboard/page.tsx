import { supabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function InternalDashboard() {
  const cookieStore = cookies();
  const supabase = supabaseServerClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Not authenticated
    return notFound();
  }

  // Optional: restrict by email via env variable
  const allowedEmail = process.env.INTERNAL_DASHBOARD_ALLOWED_EMAIL;
  if (allowedEmail && session.user.email !== allowedEmail) {
    return notFound();
  }

  // Fetch cron job statuses
  const cronJobs = await getCronJobStatuses();

  // Health check
  const healthStatus = await checkAppHealth();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Payment Rescue Internal Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Access restricted to authenticated users.{' '}
        {allowedEmail ? `(Limited to ${allowedEmail})` : ''}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">App Health</h2>
        <div className="bg-background p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${
              healthStatus.ok ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span>
              {healthStatus.ok ? 'Operational' : 'Degraded'} - {
                healthStatus.message
              }
            </span>
          </div>
          {healthStatus.details && (
            <div className="mt-2 text-sm text-muted-foreground">
              {healthStatus.details}
            </div>
          )}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Cron Jobs</h2>
        {cronJobs.length === 0 ? (
          <p className="text-muted-foreground">No cron jobs found.</p>
        ) : (
          <div className="space-y-4">
            {cronJobs.map((job) => (
              <div key={job.id} className="bg-background p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{job.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    job.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : job.status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Last run: {job.lastRun}
                </p>
                {job.output && (
                  <div className="bg-muted p-3 rounded-lg max-h-32 overflow-y-auto text-xs font-mono">
                    {job.output}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Recent Reports</h2>
        <p className="text-muted-foreground">
          Reports from cron jobs are available in the output directories. Check the
          individual job sections above for latest output.
        </p>
      </section>
    </div>
  );
}

// Helper functions
async function getCronJobStatuses() {
  const fs = await import('fs');
  const path = await import('path');
  const cronDir = '/root/.hermes/cron/output';

  try {
    const entries = fs.readdirSync(cronDir, { withFileTypes: true });
    const jobs = entries
      .filter((entry) => entry.isDirectory())
      .map((dir) => {
        const jobPath = path.join(cronDir, dir.name);
        const files = fs.readdirSync(jobPath);
        // Get most recent file by modification time
        const latestFile = files
          .map((file) => ({
            file,
            path: path.join(jobPath, file),
            mtime: fs.statSync(path.join(jobPath, file)).mtime,
          }))
          .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
          .at(0);

        let output = '';
        if (latestFile) {
          try {
            const content = fs.readFileSync(latestFile.path, 'utf8');
            // Take last 500 chars for preview
            output = content.slice(-500);
          } catch (e) {
            output = '[Could not read output]';
          }
        }

        return {
          id: dir.name,
          name: dir.name.replace(/^[0-9]+/, ''), // Remove numeric prefix if any
          status: latestFile ? 'success' : 'unknown', // We don't have exit code; assume success if file exists
          lastRun: latestFile
            ? latestFile.mtime.toLocaleString()
            : 'Never',
          output: output.trim(),
        };
      });

    return jobs;
  } catch (error) {
    console.error('Failed to read cron jobs:', error);
    return [];
  }
}

async function checkAppHealth() {
  try {
    const res = await fetch('https://payment-rescue.vercel.app', {
      method: 'HEAD',
      timeout: 5000,
    });
    if (res.ok) {
      return { ok: true, message: 'Homepage reachable', details: '' };
    } else {
      return {
        ok: false,
        message: `Homepage returned ${res.status}`,
        details: '',
      };
    }
  } catch (error) {
    return {
      ok: false,
      message: 'Failed to reach homepage',
      details: error.message,
    };
  }
}