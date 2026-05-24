# Internal Dashboard

There is an internal dashboard available at `/internal/dashboard` that provides a view of the Payment Rescue operations, including cron job status, live app checks, and reports.

## Access Control

The internal dashboard is protected by Supabase authentication and can be restricted to a specific email address via the `INTERNAL_DASHBOARD_ALLOWED_EMAIL` environment variable.

To allow access only to your email, set the following in your Vercel environment variables:

```
INTERNAL_DASHBOARD_ALLOWED_EMAIL=your@email.com
```

If the variable is not set, any authenticated user can access the dashboard.

## How it Works

The dashboard endpoint runs the `payment_rescue_ops_dashboard.py` script to generate a fresh HTML report and returns it as the response.

The script checks the health of the Payment Rescue live app, lists cron jobs, and shows recent reports.

## Development

To test the dashboard locally, you can run the script directly:

```bash
python3 scripts/payment_rescue_ops_dashboard.py
```

This will print the path to the generated HTML file.