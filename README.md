# Kapilarathna Wasana Mandiraya - Online Lottery Platform

A beautiful, static website hosted on GitHub Pages for selling Sri Lankan lottery tickets.

## Workflow (Daily Updates)

Since this platform is purely static (hosted on GitHub Pages without a database/backend), the data workflow is done via a simple Python script locally.

1. **Update CSV File:**
   Open `tickets.csv` using Excel, Notepad, or any spreadsheet software. Add all your new tickets inside or overwrite the existing ones. Ensure you keep the exact headers: `Lottery Name`, `Ticket Number`, `Draw Date`, `Draw Number`, and `Price`.

2. **Generate JSON Data:**
   Double-click the `update_data.py` file to run it, or run `python update_data.py` in your terminal.
   This script reads your `tickets.csv` and automatically converts it into `data.json`.

3. **Deploy to GitHub Pages:**
   Commit the changes in your `tickets.csv` and `data.json` to your GitHub repository.
   ```bash
   git add tickets.csv data.json
   git commit -m "Daily ticket update"
   git push origin main
   ```
   *GitHub Pages will automatically deploy your new tickets to your website.*

## Features
- Fully responsive modern UI
- Seamless cart logic & category filtering (All client-side)
- One-click checkout to WhatsApp directly to agent
- Pure HTML/CSS/JS with Tailwind CSS (CDN format).
