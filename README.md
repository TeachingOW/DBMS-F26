# SQL Reproducible HTML Presentation

This folder is ready to publish as a static GitHub Pages site. It contains no slide images and requires no build step.

## What students get

- 126 native HTML lecture slides preserving the visible wording, order, SQL, and tables from `Lecture_2_3_SQLv4_with_labs.pptx`
- 42 aligned and quick labs
- 22 advanced SQL slides
- a link from every runnable example to its own standalone general-syntax page
- a collapsible PostgreSQL database-recreation script beside every example
- copy buttons for patterns, exact queries, results, and setup SQL
- a browsable `syntax/index.html` reference with 29 SQL topics
- `demo-database.sql` as a standalone download
- slide-specific questions and comments that students can save or copy

## Preview locally

Open `index.html` in a browser. The presentation works directly from the folder.

## Publish with GitHub Pages using the website

1. Sign in to GitHub and create a new repository, such as `dbms-sql-presentation`.
2. Open the repository and choose **Add file → Upload files**.
3. Upload the **contents** of this folder. Keep `index.html` at the repository root and preserve the `labs` and `syntax` subfolders.
4. Commit the uploaded files to the `main` branch.
5. Open **Settings → Pages**.
6. Under **Build and deployment**, select **Deploy from a branch**.
7. Select the `main` branch and the `/ (root)` folder, then save.
8. After GitHub finishes publishing, open:

   `https://YOUR-USERNAME.github.io/dbms-sql-presentation/`

GitHub's documentation: [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) and [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Optional command-line upload

Run these commands from inside this folder after creating an empty GitHub repository:

```text
git init
git add .
git commit -m "Publish reproducible SQL presentation"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/dbms-sql-presentation.git
git push -u origin main
```

Then complete the **Settings → Pages** steps above.

## Updating the presentation

Replace the changed files, commit them to `main`, and push. GitHub Pages republishes from the selected branch automatically.

## Questions and comments

Students can press **Q** or select **Questions** while viewing any lecture slide, lab, or advanced SQL slide. Each slide receives its own shared discussion. Students can see everyone’s questions, respond, and use reactions directly in the presentation after signing in with GitHub. Private browser notes remain available in a separate collapsed section.

The shared conversation uses [giscus](https://giscus.app), which stores comments in GitHub Discussions. Complete this one-time setup after creating the public GitHub repository:

1. Open the repository's **Settings → General** page and enable **Discussions** under **Features**.
2. In the repository's **Discussions** area, create or choose a category such as **Slide Questions**.
3. Install the [giscus GitHub App](https://github.com/apps/giscus) and grant it access to the course repository.
4. Open [giscus.app](https://giscus.app), enter `YOUR-USERNAME/dbms-sql-presentation`, and choose the discussion category.
5. At the bottom of the giscus configuration page, copy the generated `data-repo-id` and `data-category-id` values.
6. Open `questions-config.js` and enter all four values:

   ```javascript
   window.DBMS_QUESTIONS_CONFIG = {
     githubRepo: 'YOUR-USERNAME/dbms-sql-presentation',
     giscusRepoId: 'COPY-DATA-REPO-ID-HERE',
     giscusCategory: 'Slide Questions',
     giscusCategoryId: 'COPY-DATA-CATEGORY-ID-HERE'
   };
   ```

7. Commit and upload the changed configuration file.

The presentation uses a stable internal key for each lecture slide, lab, and advanced slide, so each item always reopens the same shared discussion. Students need a GitHub account to post, but anyone who can view the public course site can read the conversation.

## Database setup

The examples use PostgreSQL 16+ syntax. Create an empty database, open its SQL editor, and run `demo-database.sql`. The script drops and recreates only the teaching tables used by this presentation. Rerun it whenever you want a clean starting state.
