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

## Database setup

The examples use PostgreSQL 16+ syntax. Create an empty database, open its SQL editor, and run `demo-database.sql`. The script drops and recreates only the teaching tables used by this presentation. Rerun it whenever you want a clean starting state.
