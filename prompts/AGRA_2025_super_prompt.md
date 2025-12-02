# AGRA 2025 QC Dashboard Super-Charged Prompt

Copy-paste this into a new chat alongside the `AGRA_2025.xlsx` data dictionary to guide dashboard generation.

---

You are an expert full-stack web developer and data visualization engineer. Your job is to **design and build a complete, production-ready QC (Quality Control) dashboard web app** for the **AGRA 2025 surveys**, using the structure of my Excel data dictionary.

---

### 1. Files & Data Dictionary

I have an Excel file named **`AGRA_2025.xlsx`** with **three sheets**, each representing a separate project:

1. `AGRA FARMER`
2. `AGRA ENTERPRISE`
3. `AGRA YOUTH`

Each sheet is a **data dictionary** with two columns:

* `NAME` → variable code (this will be the actual column name in the raw data)
* `LABEL` → full question text / human-readable label

**Assumptions you should make:**

* In the *real* datasets, each `NAME` value will be a column.
* The dashboard should:

  * Use `NAME` as the **field key** in code.
  * Use `LABEL` as the **display label** (for tooltips, table headers, filter labels, etc.).
* Each sheet corresponds to one **tab** in the dashboard.

---

### 2. High-Level Dashboard Goal

Build a **real-time QC dashboard** with:

* **3 main tabs** (one per project):

  * `AGRA FARMER`
  * `AGRA ENTERPRISE`
  * `AGRA YOUTH`
* Each tab shows:

  * KPI cards
  * Charts (bar + donut/pie + trend)
  * Map (where GPS exists)
  * Data tables (quota / breakdowns / rankings / recent submissions)
* Design + layout should **replicate the look & UX** of:
  `https://ogstep-qc-realtime.netlify.app/`
  If you cannot access it:

  * Use a dark navy theme
  * Large modern KPI cards at the top
  * Donut/pie charts and bar charts in the middle
  * Tables and rankings below
  * Clean, modern layout with good spacing

⚠️ **Important domain rule:**
My questionnaire **does NOT have “Pillar” or “Pillar Path” concepts**.
Do **NOT** create anything called Pillar/Pillar Path.
Instead, use real variables from the AGRA data dictionary: **gender, age/age category, location (region/district/village), value chain–style variables, youth employment type, etc.**

---

### 3. Tech Stack

Use a modern front-end stack:

* **React** with **TypeScript**
* **Tailwind CSS** for styling (dark navy theme)
* A charting library: **Recharts** (preferred) or **Chart.js**
* **Leaflet** for maps (with OpenStreetMap tiles)

Assume something like **Vite + React + TypeScript** as the starter.

Organize code into clean components.

---

### 4. How to Use the Data Dictionary (AGRA_2025.xlsx)

Assume you have access to `AGRA_2025.xlsx` (the same file I uploaded).

1. For each sheet (`AGRA FARMER`, `AGRA ENTERPRISE`, `AGRA YOUTH`):

   * Read the rows.
   * For each row, treat:

     * `NAME` as `fieldName`
     * `LABEL` as `fieldLabel`
2. Build a mapping like:

```ts
type FieldMeta = { name: string; label: string };

type ProjectDictionary = {
  projectId: "FARMER" | "ENTERPRISE" | "YOUTH";
  sheetName: string;
  fields: FieldMeta[];
};
```

3. Use this to:

   * Name filters (e.g. “DB7. Gender” → gender filter)
   * Name columns in tables
   * Choose candidate fields for KPIs and chart groupings

You can **hardcode** a curated subset of key fields (listed below) as the main dimensions for the dashboard, and assume other fields exist in the full dataset.

---

### 5. Key Variables Per Project (Use These in the Dashboard)

#### 5.1 Shared “Meta” Fields (common patterns in all surveys)

Across the sheets, you will see meta fields like:

* `SubmissionDate` → “Submission Date”
* `starttime` → “Start Time”
* `endtime` → “End Time”
* `deviceid` → “Device ID”
* `devicephonenum` → “Device Phone Number”
* `caseid` → “Case ID”
* `username` → enumerator/interviewer identifier
* `duration` → interview duration

Use these for:

* “Latest Submission” timestamps
* Interview duration distributions
* Basic QC/time tracking

---

#### 5.2 `AGRA FARMER` – Important Fields

In the **`AGRA FARMER`** sheet, there are key demographic and location variables (exact `NAME` and `LABEL`):

* **Age & Gender**

  * `db5` → “DB5. Age”
  * `db6` → “DB6. Age Category”
  * `db7` → “DB7. Gender”
  * `d10` → “D10 What is your gender?”
    Use these for:

    * Gender distribution charts
    * Age or age-category breakdowns in tables/charts.

* **Location**

  * `db10` → “DB10. District”
  * `db11` → “DB11. Region/Province”
  * `db14` → “DB14. Village”
    Use these for:

    * Regional quota/coverage charts
    * Quota tracker by region/district
    * Filters for district/region.

These variables should drive:

* **KPI splits** like:

  * “# Farmer respondents by gender”
  * “# Farmer respondents by age category”
  * “Coverage by region/district”
* **Charts**:

  * Bar chart: Submissions by `db11` (Region/Province)
  * Donut chart: Gender split (`db7` or `d10`)
  * Heat/coverage table by `db11` × `db6`

---

#### 5.3 `AGRA ENTERPRISE` – Important Fields

In the **`AGRA ENTERPRISE`** sheet, examples of important fields:

* **Owner Age & Gender**

  * `B2_Q` → “B2. What is the age of the (male) owner … in completed years?”
  * `B3_Q` → “B3. What is the age of the (female) owner … in completed years?”
  * `A10_Q` → “A10. What is the gender of the respondent?”
  * `B1_Q` → “B1. What is the gender of the owner or owners?”
    Use these for:

    * Age distribution of owners
    * Gender distribution of owners.

* **Location**

  * `B14_Q` → “B14. In which district or districts did the business mainly operate?”
    Use for:

    * Quota/coverage by district
    * Regional tables.

* **QC / validation**

  * `DB2`-type validation item: “Validation: Verify database information with the respondent”
    Use this conceptually for:

    * QC validation checks count
    * A table of validated vs not-validated cases (you can assume a `validation_status` field exists in the actual dataset).

These should drive:

* KPI cards like:

  * “# Enterprises surveyed”
  * “% female-led enterprises” (from `B1_Q` / `A10_Q`)
  * “Average age of owner(s)”
* Charts:

  * Bar chart: enterprises by district (`B14_Q`)
  * Donut: gender of owners
  * Trend: enterprises interviewed over time

---

#### 5.4 `AGRA YOUTH` – Important Fields

In the **`AGRA YOUTH`** sheet, there are key youth + GPS fields:

* **Sex / Gender**

  * `D4` → “D4. Sex of respondent”
    Use for:

    * Gender split KPIs
    * Donut charts of male vs female youth.

* **GPS & Location**

  * `D8_Latitude` → “D8-Latitude”
  * `D8_Longitude` → “D8-Longitude”
  * `D8_Altitude` → “D8-Altitude”
  * `D8_Accuracy` → “D8-Accuracy”
  * `D9.` (NAME may be `D9` or similar) → label: “D9. Location type”
    Use these for:

    * Map plotting
    * Location type breakdown (e.g. rural/urban/peri-urban if encoded).

* **Youth-specific filters**

  * `RS1`, `RS2`, etc. are about youth age & engagement:

    * RS items describe being 18–35 and engagement in farming, off-farm, etc.
      Use these conceptually for:
    * KPIs on “youth in farming vs off-farm ag vs non-ag”
    * Bar charts by activity.

These should drive:

* KPI examples:

  * “# Youth respondents”
  * “% female youth respondents”
  * “% youth engaged in farming vs off-farm ag vs non-agric”
* Charts:

  * Donut: sex of respondent (`D4`)
  * Bar: youth employment type (`RS2` + sub-items)
* Map:

  * Plot markers using `D8_Latitude` + `D8_Longitude`
  * Color by `D4` (sex) or engagement group or interview status (assume a `status` field in the real data).

---

### 6. Global Header & Tabs (UI Requirements)

The dashboard should have:

* **Global header at the top**:

  * Logo placeholder (e.g. “AGRA QC”)
  * Title: “AGRA 2025 QC Realtime Dashboard”
  * Subtitle: “Unified monitoring for Farmer, Enterprise, and Youth projects”
  * **Last refreshed** timestamp (based on data refresh)
  * **Latest submission** timestamp (latest `SubmissionDate` or `endtime`)
  * **Refresh button** (manual refresh)
  * A small **settings / theme toggle** icon (dark/light).

* **Tab navigation** under the header:

  * Tab 1 → “AGRA FARMER”
  * Tab 2 → “AGRA ENTERPRISE”
  * Tab 3 → “AGRA YOUTH”
  * Clicking a tab switches the entire content to that project’s KPIs, charts, map, and tables.

---

### 7. Per-Tab Layout

For **each tab** (Farmer, Enterprise, Youth), implement this structure:

1. **Row 1 – KPI cards**
2. **Row 2 – Charts**
3. **Row 3 – Map (if GPS exists; definitely for Youth with D8_Latitude/Longitude)**
4. **Row 4 – Data tables**

#### 7.1 KPI Cards (Row 1)

Examples (adapted per project):

* **Total Submissions**

  * Count of all records for that project.
* **Valid / Approved Submissions**

  * Assume there is a status/approval field in the real data; simulate with sample data now.
* **Gender Distribution**

  * Farmer: from `db7`/`d10`
  * Enterprise: from `B1_Q` / `A10_Q`
  * Youth: from `D4`
* **Age / Age Category Highlights**

  * Farmer: `db5` / `db6`
  * Enterprise: `B2_Q` / `B3_Q`
* **Coverage by Region/District**

  * Farmer: `db11`, `db10`
  * Enterprise: `B14_Q`
* **Youth Engagement (Youth tab)**

  * % in farming vs off-farm ag vs non-ag (from RS items)

Each card should have:

* Title
* Large main value
* Optional secondary text (e.g. “of target”, “vs last week”)
* Color-coded based on thresholds (green/yellow/red).

---

#### 7.2 Charts (Row 2)

Per project, build at least **3 charts**:

* **Donut / Pie chart**:

  * Farmer: Gender distribution (`db7`/`d10`)
  * Enterprise: Gender of owners (`B1_Q`)
  * Youth: Sex of respondent (`D4`)

* **Bar chart (coverage / quota)**:

  * Farmer: submissions by Region/Province (`db11`) or District (`db10`)
  * Enterprise: enterprises by District (`B14_Q`)
  * Youth: respondents by Location type (`D9`)

* **Trend chart**:

  * Submissions per day using `SubmissionDate` or date part of `starttime`.

Use the **AGRA variable codes** from `NAME` as field keys in code and the `LABEL` for display.

---

#### 7.3 Map (Row 3)

Implement a **Leaflet map**:

* For **AGRA YOUTH**, use:

  * `D8_Latitude` and `D8_Longitude` as coordinates
* For other projects (Farmer/Enterprise):

  * If no GPS in dictionary, you can:

    * Either simulate coordinates in sample data, OR
    * Provide a non-map placeholder and explicitly comment where GPS-based plotting would go once real data has GPS fields.

Map features:

* Marker per submission
* Popup shows:

  * `caseid`
  * `SubmissionDate` / `starttime`
  * Basic demographics (e.g. `D4` sex, or `db7` gender, or owner gender)
* Filters above the map:

  * Project-specific region/district filters
  * Approval/validity status (simulated in sample data)
  * For Youth: location type (`D9`), maybe engagement type (RS items)
* Toggle to color markers by:

  * Approval status / QC status
  * Or gender/sex

---

#### 7.4 Data Tables (Row 4)

Create tables like:

1. **Quota / Coverage Table**

   * Farmer:

     * Group by `db11` (Region/Province) or `db10` (District)
   * Enterprise:

     * Group by `B14_Q` (District)
   * Youth:

     * Group by `D9` (Location type) or region if available
   * Columns:

     * Region/District
     * Count of submissions
     * (Optional) target vs achieved (simulated)
     * % of total

2. **Demographic Breakdown Table**

   * Age × Gender counts per project using the relevant fields:

     * Farmer: `db6` × `db7`
     * Enterprise: `B2_Q`/`B3_Q` binned + `B1_Q`
     * Youth: RS items + `D4`

3. **Interviewer/Enumerator/Respondent Table**

   * Use `username` or equivalent as the enumerator.
   * Columns:

     * Enumerator ID
     * Total submissions
     * Average duration (`duration`)
     * Approval/validity rate (simulated status).

4. **Recent Submissions Table**

   * Show last N (20–50) submissions with:

     * `SubmissionDate` or `starttime`
     * `caseid`
     * Project-specific key fields (e.g. gender, region, location type)
     * QC/approval status (simulated)

Each table should have:

* Sortable columns
* Basic search
* A small **“Export CSV”** button.

---

### 8. Real-Time Behavior & Refresh

Implement **simulated** real-time behavior:

* Auto-refresh every **1 hour** in concept (use a shorter interval in code, like 30–60 seconds, with a comment).
* On refresh:

  * Recalculate KPIs & charts
  * Update “Last refreshed” timestamp
  * Optionally generate a few new fake rows in the sample data to simulate new submissions.

---

### 9. Styling & UX

* Dark navy theme, similar to the reference dashboard.
* Use Tailwind CSS for:

  * Layout (grid/flex)
  * Typography
  * Spacing and shadows on cards
* Add smooth hover effects and transitions.
* Make layout responsive.

---

### 10. Deliverables

Please:

1. Build the full React + TypeScript + Tailwind dashboard as described, with:

   * 3 tabs (`AGRA FARMER`, `AGRA ENTERPRISE`, `AGRA YOUTH`)
   * KPI cards, charts, map, and tables per tab.
2. Use **the actual AGRA variable codes** from the data dictionary (NAME) and human labels (LABEL) for:

   * Field keys
   * Display labels
3. Do **not** use “Pillar” or “Pillar Path” anywhere.
4. Clearly comment where:

   * Sample data should be swapped with real project data.
   * Real Google Sheets / API integration should be added.

---

**End of prompt.**

---

If you want, next step I can:

* Make a **shorter version** of this prompt.
* Or help you design the **sample data structures** for each of the three projects (Farmer/Enterprise/Youth) that match these variable names.
