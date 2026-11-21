# DBMS-F26 Teaching Materials

This folder is a static GitHub Pages site and requires no build step to serve.

## What students get

- 126 native HTML lecture slides preserving the visible wording, order, SQL, and tables from `Lecture_2_3_SQLv4_with_labs.pptx`
- 42 aligned and quick labs
- 22 advanced SQL slides
- a link from every runnable example to its own standalone general-syntax page
- a collapsible PostgreSQL database-recreation script beside every example
- copy buttons for patterns, exact queries, results, and setup SQL
- a browsable `syntax/index.html` reference with 29 SQL topics
- `demo-database.sql` as a standalone download
- a [MongoDB presentation](mongodb.html) with a [PowerPoint download](lectures/14_MongoDB.pptx) and a [hands-on mongosh lab](labs/nosql/mongodb.html) using the same shop dataset
- a [lecture library](lectures/library/index.html) with PowerPoint downloads and browser slides for the other organized lectures

## 32-meeting teaching plan

Open [course-plan.html](course-plan.html) for 16 weeks, two 100-minute meetings per week (53 hours 20 minutes). Each meeting links to an existing lecture, a timed activity, and a student deliverable. The plan includes 11 supplemental exercise pages, a shared PostgreSQL fixture, a 100,000-row performance dataset, reference queries, stored programs, a Python booking starter, and openly available instructor checkpoints under `labs/semester/`.

The new executable labs use PostgreSQL 16+; the application uses Python with `psycopg[binary]`. Existing MySQL/MariaDB lecture examples remain unchanged. No PowerPoint or rendered lecture assets are modified. Quizzes and project milestones are scheduled without changing course grading weights. Reconcile the 32 slots with holidays and any separately scheduled final exam.

To regenerate the plan and exercise HTML after editing its source, run `python scripts/build-course-plan.py`. SQL and Python starters are maintained directly in `labs/semester/`. The instructor guide is public, not a protected exam answer key.

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

### MongoDB slides

Edit `lectures/14_MongoDB.pptx` first. Then run `python3 scripts/generate-mongodb-slides.py` from the repository root to regenerate the HTML slide data. Run the same command with `--check` to verify that the two versions match. Keep the existing slide text box names when editing or duplicating slides in PowerPoint.

The live site publishes from `gh-pages`. Update both the PowerPoint and the generated slide data on that branch when releasing changes.

## Database setup

The examples use PostgreSQL 16+ syntax. Create an empty database, open its SQL editor, and run `demo-database.sql`. The script drops and recreates only the teaching tables used by this presentation. Rerun it whenever you want a clean starting state.

## Lecture library

The published PowerPoints in `lectures/library/` are the source for the browser decks. Each uses an editable DBMS-F26 footer. With LibreOffice (`soffice`) and Python packages `pypdfium2`, `pypdf`, and `Pillow` available, run `python3 scripts/generate-lecture-library.py "/path/to/Organized Lectures"` from the repository root. The organized lecture folder supplies the catalog and slide titles. The script renders the published PowerPoints and regenerates the HTML, slide images, selectable text, and links. Slides marked hidden in PowerPoint keep their original positions and are labeled in the browser.


## Editable non-SQL presentations

Non-SQL PowerPoint content is extracted to structured JSON under content/decks-json/; a separate HTML viewer renders a presentation layer under presentations/editable/. No slide screenshots are used. Run `python scripts/pptx_to_json.py` to regenerate both layers from source decks in `slides/`. JSON retains speaker notes without rendering them, plus ordered scene-object references, positions, editable geometry, text styling, connector links, and animation targets. The viewer still needs work to reproduce PowerPoint layout and styling faithfully. See [the JSON extraction model](docs/pptx-json-schema.md).

