# Plan: Client-Side FAIRness Website Modeled on Existing App

You want to build a static, client-side website (for GitHub Pages) with the look and functionality of http://localhost:3000/ (code at /mnt/HDD13T/ata/backup_ubuntu/ubuntu/project/nfdi-data-registry/), but with all data (JSON ingest files) bundled as an npm package and loaded client-side—no backend.

---

**Steps**

### Phase 1: Discovery & Analysis
1. Review the /mnt/HDD13T/ata/backup_ubuntu/ubuntu/project/nfdi-data-registry/ codebase to:
   - Identify the frontend framework (likely React, Next.js, or similar)
   - Determine how data is currently loaded (API calls, file reads, etc.)
   - List all required JSON ingest files and their structure
2. Review the rdi-fairness-interviews folder for all ingest/data files to be packaged.

### Phase 2: Data Packaging
3. Create a new npm package (e.g., @fairagro/rdi-fairness-data) containing all required JSON ingest files.
4. Ensure the package exports the data in a way that can be easily imported in a frontend app.

### Phase 3: Frontend Refactor
5. Fork or copy the nfdi-data-registry frontend code as the base for the new site.
6. Refactor data loading logic:
   - Remove backend/API dependencies
   - Replace with imports from the npm data package
   - Ensure all data-driven components work with the new import method

### Phase 4: Static Site Generation
7. Configure the app for static export (e.g., Next.js `next export`, Vite static build, or CRA static build).
8. Ensure all routes/pages work client-side only (no SSR or API routes).
9. Add a .nojekyll file for GitHub Pages compatibility.

### Phase 5: Testing & Polish
10. Test the site locally to ensure all data loads and UI matches the original.
11. Check for performance, accessibility, and mobile responsiveness.
12. Update branding, text, and references to match the FAIRness publication.

### Phase 6: Deployment
13. Push the static build to a GitHub repository.
14. Configure GitHub Pages to serve the static site.
15. Document the build and deployment process in README.md.

---

**Relevant files**
- `/mnt/HDD13T/ata/backup_ubuntu/ubuntu/project/nfdi-data-registry/` — Source frontend code
- `/mnt/HDD13T/ata/backup_ubuntu/ubuntu/project/FAIRagro/data/data_fairagro/rdi-fairness-interviews/` — JSON ingest/data files
- New npm package: `@fairagro/rdi-fairness-data` (to be created)
- Static build output (e.g., `/out` or `/build`)

---

**Verification**
1. Site loads on GitHub Pages with no backend/API.
2. All data is loaded from the npm package, not from a server.
3. UI and features match the original app at http://localhost:3000/.
4. All ingest data is present and functional.
5. Site is fully static and client-side.

---

**Decisions**
- All data will be bundled as an npm package for easy import.
- No backend or server-side code will be used.
- The site will be statically exported for GitHub Pages.

---

**Further Considerations**
1. If the original app uses SSR or dynamic routing, adapt for static export.
2. If ingest files are large, consider lazy loading or chunking for performance.
3. If you want to publish the npm package publicly, set up npm publishing workflow.

Let me know if you want to proceed with a specific framework, need help with npm packaging, or want a more detailed breakdown of any step!
