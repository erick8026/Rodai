# RODAI Website Deployment Guide

## Quickest option: Netlify Drop
1. Create a free Netlify account.
2. Open the Netlify dashboard and use Netlify Drop / drag-and-drop deployment.
3. Upload the entire `rodai_site` folder or the contents of this folder.
4. Netlify will publish the site and give you a temporary URL.
5. In Site settings, connect your custom domain `rodai.io` when ready.

## Git-based option: GitHub Pages
1. Create a new GitHub repository.
2. Upload all files from `rodai_site` to the repository root.
3. In GitHub, go to Settings > Pages.
4. Select the branch and folder (`/root`) as the publishing source.
5. Save and wait for GitHub Pages to publish the site.

## Better long-term option: Vercel
1. Create a Vercel account.
2. Import the project from GitHub or upload it with the Vercel CLI.
3. Vercel will detect it as a static site and deploy it.
4. Add `rodai.io` in Project Settings > Domains.

## Domain setup checklist
- Point the domain or subdomain from your DNS provider to the hosting platform.
- Enable HTTPS/SSL in the hosting dashboard.
- Test WhatsApp, email, brochure downloads, and mobile view.
- Replace temporary brochure files later if you update marketing materials.
