# Owner editing setup

The website editor is ready at `/admin/`, but GitHub requires a secure login
server before it can let an editor save changes. This is a one-time setup that
uses the free tiers of GitHub and Cloudflare Workers.

## What the owner will be able to edit

- Business name, phone number, address, service area, hours and insurance copy
- The hero, services, project-section and contact-section copy
- Both service cards and their photos
- FAQs
- Project gallery entries, including adding, replacing and removing photos

The editor deliberately does not expose the website layout, CSS, or JavaScript.

## Before starting

1. The editor needs a GitHub account with **write access** to
   `PeterLevin08/RM-General-Contractor`.
2. Create or sign in to a free [Cloudflare account](https://dash.cloudflare.com/).
3. Do not put GitHub client IDs or secrets in this repository, in Decap's
   configuration, or in a browser field.

## One-time authentication setup

### 1. Deploy the free OAuth proxy

Use the maintained
[Decap Cloudflare proxy](https://github.com/sterlingwes/decap-proxy) project.
Follow its Cloudflare Worker deployment instructions. Deploy it first so that
Cloudflare gives the worker a URL such as:

`https://rm-contractor-cms-auth.<your-account>.workers.dev`

Opening that URL should show the proxy's `Hello` page after it is deployed.

### 2. Create a GitHub OAuth App

While signed in to the GitHub account that owns the website repository, open
[New OAuth App](https://github.com/settings/applications/new) and enter:

- **Application name:** `RM General Contractor Website Editor`
- **Homepage URL:** the Cloudflare Worker URL from step 1
- **Authorization callback URL:** the same Worker URL followed by `/callback`

Save the app. GitHub shows a **Client ID** and lets you generate a **Client
secret**. Treat the secret like a password.

### 3. Add the two values to Cloudflare, not this site

In the Cloudflare Worker’s **Settings → Variables and Secrets**, add both as
secrets:

- `GITHUB_OAUTH_ID` — the GitHub Client ID
- `GITHUB_OAUTH_SECRET` — the GitHub Client secret

If the GitHub repository is private, also follow the proxy project's private
repository configuration step.

### 4. Point Decap at the Worker

In `admin/config.yml`, replace only this placeholder:

```yaml
base_url: https://REPLACE-WITH-YOUR-CLOUDFLARE-WORKER.workers.dev
```

with the actual Worker URL from step 1. Commit and push that change to the
GitHub `main` branch.

### 5. Test the editor

Open `<your-site-url>/admin/`, choose **Login with GitHub**, and approve the
GitHub prompt. Open **Website copy, contact details and gallery**, make a small
text change, and choose **Publish**. Decap creates a normal Git commit that can
be reviewed or reverted in GitHub.

## Publishing CMS edits

Decap saves edits to GitHub. The website reads the published content and
uploaded gallery photos from the public repository, so copy and gallery edits
can appear without using Shell or manually copying files into Replit.

If you later change the website's HTML, CSS, or JavaScript, redeploy the Replit
Static Deployment (or connect the repository to a static host that redeploys on
commits, such as Cloudflare Pages or Netlify).

## Editing photos

In the editor, open **Project gallery**. Each gallery item has a **Project
photo** field. Uploading a replacement creates a file under `assets/uploads/`;
removing a gallery item removes it from the website. Use a descriptive
**Photo description for accessibility** for every photo.

## Rollback

Every publish appears in the GitHub repository history. In GitHub, open the
commit and use **Revert** to undo an unwanted change, then publish the updated
site again.