# Product Requirements Document: Advanced Leave Calculator

**Document Version:** 1.0
**Date:** July 10, 2025
**Author:** Adedotun Gabriel

---

## 1\. Introduction

The Advanced Leave Calculator is a web application designed to simplify the process of calculating various types of employee leave, taking into account working days, weekends, and public holidays. It aims to provide accurate leave expiration and resumption dates, offering flexibility for users to manage public holidays specific to Nigeria. The application will prioritize a user-friendly interface and local-first data persistence for a seamless experience.

## 2\. Goals

- To accurately calculate leave durations based on specified rules (working days only, public holiday exclusion).
- To provide clear leave expiration and resumption dates.
- To empower users with control over the public holiday list (add, remove).
- To offer a responsive and intuitive user interface.
- To function primarily offline as a Progressive Web Application (PWA) with occasional online synchronization for holiday updates.

## 3\. User Stories

As a user, I want to:

- **Calculate Vacation/Annual Leave:**
  - Select "Vacation/Annual Leave" as the leave type.
  - Input my Grade Level (GL) so the system automatically determines my leave entitlement (21 or 30 days).
  - Select a start date for my leave.
  - See my calculated leave expiration date and my resumption date.
  - See a list of all public holidays that were skipped during my leave period.
- **Calculate Maternity Leave:**
  - Select "Maternity Leave" as the leave type.
  - Select a start date for my leave.
  - See my calculated leave expiration date and my resumption date (112 working days).
  - See a list of all public holidays that were skipped during my leave period.
- **Calculate Other Leaves (Casual, Study, Sick, Sabbatical):**
  - Select the specific leave type (e.g., "Casual Leave").
  - Input the desired number of leave days.
  - Select a start date for my leave.
  - See my calculated leave expiration date and my resumption date.
  - See a list of all public holidays that were skipped during my leave period.
- **Manage Public Holidays:**
  - View a list of all currently recognized public holidays.
  - Add a new public holiday by specifying its name and date.
  - Remove an existing public holiday from the list.
  - Have the public holiday list persist across sessions.
  - Optionally refresh the public holiday list from an external source (API).

## 4\. Features

### 4.1. Leave Calculation Engine

This is the core logic responsible for determining leave durations, respecting working days, weekends, and public holidays.

**4.1.1. Core Logic:**

- **Input:** Start Date, Number of Leave Days, List of Public Holidays.
- **Process:**
  1. Initialize `currentDate` to `startDate`.
  2. Initialize `workingDaysCount` to 0.
  3. Loop while `workingDaysCount` is less than `Number of Leave Days`:
     - Check if `currentDate` is a Saturday or Sunday. If yes, increment `currentDate` by one day and continue to the next iteration (do not count as a working day).
     - Check if `currentDate` is present in the `List of Public Holidays`. If yes, add `currentDate` to a `skippedHolidays` list, increment `currentDate` by one day, and continue to the next iteration (do not count as a working day).
     - If `currentDate` is neither a weekend nor a public holiday, increment `workingDaysCount` by 1.
     - Increment `currentDate` by one day.
  4. The `currentDate` at which the loop finishes (after incrementing for the last working day) will be the day _after_ the leave expires.
  5. `Leave Expiration Date`: The day _before_ the `currentDate` from step 4.
  6. `Resumption Date`: The first working day _after_ the `Leave Expiration Date`, ensuring it's not a weekend or public holiday. This can be found by continuing to increment `currentDate` from step 4 until a non-weekend/non-holiday is found.
  - **Output:** Leave Expiration Date, Resumption Date, List of Skipped Public Holidays.

**4.1.2. Leave Types and Rules:**

- **Vacation/Annual Leave:**
  - User selects "Vacation/Annual Leave".
  - User is prompted to enter "Grade Level (GL)".
  - **GL 0-06:** 21 working days.
  - **GL 07 upwards:** 30 working days.
  - Calculation uses the Core Logic (4.1.1) with the determined number of days.
- **Maternity Leave:**
  - User selects "Maternity Leave".
  - Fixed duration: 112 working days.
  - Calculation uses the Core Logic (4.1.1) with 112 days.
- **Casual Leave, Study Leave, Sick Leave, Sabbatical Leave:**
  - User selects the specific leave type.
  - User is prompted to enter "Number of Days".
  - Calculation uses the Core Logic (4.1.1) with the user-provided number of days.

### 4.2. Public Holiday Management

This feature allows users to control the list of public holidays used in calculations.

**4.2.1. Initial Holiday Data:**

- The application will initially attempt to fetch public holidays from `https://api.api-ninjas.com/v1/publicholidays?country=Nigeria`.
- **API Key Handling:** The API key for `api-ninjas.com` **must not** be hardcoded or exposed directly in the client-side code. A secure method (e.g., a server-side proxy, serverless function, or environment variable management during deployment) should be used to handle API requests. For the purpose of this PRD, we assume the application will receive the holiday data securely.
- Upon successful fetch, the holidays will be stored in Local Storage.
- The application should handle cases where the API call fails (e.g., network error, invalid key) by using the last saved local holiday data or starting with an empty list if no data exists.

**4.2.2. User Control:**

- **View Holidays:** A dedicated section or modal will display the current list of public holidays, showing their name and date.
- **Add Holiday:**
  - Users can manually add a new public holiday.
  - Input fields: Holiday Name (text), Holiday Date (date picker).
  - Validation: Ensure date is valid and format is consistent. Prevent duplicate holidays on the same date.
- **Remove Holiday:**
  - Each holiday in the displayed list will have an option (e.g., a "delete" button/icon) to remove it.
  - A confirmation prompt should appear before deletion.
- **Persistence:** All changes (additions, removals) to the public holiday list will be immediately saved to Local Storage.

### 4.3. Leave Input and Output

This defines the user interface elements for interacting with the calculator and displaying results.

**4.3.1. Input Form:**

- **Leave Type Selection:** A dropdown or radio buttons for selecting:
  - Vacation/Annual Leave
  - Maternity Leave
  - Casual Leave
  - Study Leave
  - Sick Leave
  - Sabbatical Leave
- **Grade Level (GL) Input:** (Conditionally visible for Vacation/Annual Leave)
  - A dropdown or numerical input for GL (e.g., 01, 02, ..., 17).
- **Number of Days Input:** (Conditionally visible for Casual, Study, Sick, Sabbatical Leave)
  - A numerical input field.
- **Start Date Input:**
  - A date picker component allowing users to select the desired start date for their leave.
- **Calculate Button:** Triggers the leave calculation.

**4.3.2. Output Display:**

- **Calculated Dates:**
  - "Leave Expiration Date:" (e.g., "YYYY-MM-DD")
  - "Resumption Date:" (e.g., "YYYY-MM-DD")
- **Skipped Public Holidays:**
  - A clear list or section titled "Public Holidays Skipped:"
  - Each skipped holiday will be listed with its name and date (e.g., "New Year's Day: January 1, 2025").

## 5\. Technical Specification

### 5.1. Core Technologies

- **Frontend Framework:** React
  - **Build Tool:** Vite (for fast development, optimized builds, and PWA capabilities).
  - **PWA Setup:** Utilize Vite's PWA plugin to generate a service worker and manifest file, enabling offline capabilities and installability.
- **Date Management:** `date-fns`
  - Used for all date-related operations: parsing, formatting, adding days, checking weekends, comparing dates, etc.
- **Styling:** Tailwind CSS
  - Utility-first CSS framework for rapid and consistent styling.
  - Consider integrating `shadcn/ui` components built on Tailwind for pre-styled, accessible UI elements (e.g., Button, Input, Select, DatePicker).
- **State Management:** Zustand
  - A lightweight, fast, and scalable state-management solution for React.
  - Will manage application-wide state such as the public holiday list, current leave calculation inputs, and results.
- **Local Persistence:** Local Storage
  - Used to store the user-managed public holiday list.
  - Used to store last-used GL or other user preferences for convenience.

### 5.2. Data Model (Local Storage)

- **`publicHolidays` (Array of Objects):**

````json
    [
      {
        "name": "New Year's Day",
        "date": "2025-01-01" // ISO 8601 format
      },
      {
        "name": "Eid al-Fitr",
        "date": "2025-03-31"
      }
      // ... more holidays
    ]
    ```
  * **`lastUsedGL` (String/Number):** Stores the last selected Grade Level for user convenience.
  * **`lastSelectedLeaveType` (String):** Stores the last selected leave type.

### 5.3. API Integration (Public Holidays)

  * **Endpoint:** `https://api.api-ninjas.com/v1/publicholidays?country=Nigeria`
  * **Method:** GET
  * **Authentication:** Requires an API key.
  * **Example Response Structure (from API):**
    ```json
    [
        {
            "name": "National Youth Day",
            "local_name": "National Youth Day",
            "date": "2025-11-01",
            "country": "NG",
            "year": 2025,
            "regions": [],
            "federal": true
        },
        {
            "name": "Christmas Day",
            "local_name": "Christmas Day",
            "date": "2025-12-25",
            "country": "NG",
            "year": 2025,
            "regions": [],
            "federal": true
        }
    ]
    ```
  * **Processing API Response:** When fetching, the application will iterate through the array of holiday objects received from the API and extract only the name and date fields to store locally. Other fields like local_name, country, year, regions, and federal will be disregarded for local storage to keep the data model concise and consistent with manually added holidays.
  * **Implementation Note:** The API call should ideally be abstracted behind a
server-side proxy or a serverless function to prevent exposing the API key on the client. If this is not feasible, the user should be made aware of the security implications if the key is directly embedded or requested client-side. The application will primarily rely on the locally stored holiday data. A "Refresh Holidays" button could trigger an update from the API.

## 6\. User Interface (UI) / User Experience (UX) Considerations

  * **Clean and Intuitive Layout:** Use a single-page application approach with clear sections for inputs, results, and holiday management.
  * **Responsive Design:** Ensure the application is fully responsive and works well on various screen sizes (mobile, tablet, desktop) using Tailwind's responsive utilities.
  * **Date Picker:** Implement an easy-to-use date picker component (e.g., from `shadcn/ui` or a `date-fns` compatible library).
  * **Feedback:** Provide clear feedback to the user on calculation success, errors, or when holidays are added/removed.
  * **Accessibility:** Ensure the application is accessible to users with disabilities (e.g., proper ARIA attributes, keyboard navigation).
  * **Loading States:** Display loading indicators when fetching data (e.g., initial holiday load, API refresh).
  * **Error Handling:** Gracefully handle network errors or API failures, informing the user.

## 7\. Acceptance Criteria

  * **General:**
      * The application loads correctly as a PWA.
      * All UI elements are responsive across devices.
      * All user inputs are validated.
      * Error messages are clear and helpful.
  * **Leave Calculation:**
      * Vacation/Annual Leave calculates 21 working days for GL 0-06 and 30 working days for GL 07+ correctly.
      * Maternity Leave calculates 112 working days correctly.
      * Casual/Study/Sick/Sabbatical Leave calculates the user-specified number of working days correctly.
      * All calculations correctly exclude Saturdays, Sundays, and public holidays.
      * Leave Expiration Date is accurate.
      * Resumption Date is accurate (first working day after expiration).
      * The list of skipped public holidays is accurate and displayed clearly.
  * **Public Holiday Management:**
      * The application successfully fetches initial public holidays (or handles failure gracefully).
      * Users can view the current list of holidays.
      * Users can successfully add a new public holiday (name, date).
      * Users can successfully remove an existing public holiday.
      * All changes to the public holiday list persist in Local Storage.
      * The application correctly uses the user-managed holiday list for calculations.
````
