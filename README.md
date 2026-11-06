# MAST5112 — Chef's Menu Manager (Final POE Submission)

##  Project Overview
This is the final version of the Chef's Menu Manager, a React Native mobile application for restaurant staff to create, manage, and view menu items.

---

##  NEW FEATURES — Changes Implemented Since Part 2

### 1. Manage Menu Items
- **Edit existing items:** Can now modify dish name, description, course, and price. Changes update instantly in the list.
- **Delete items:** Remove items from the menu with a confirmation prompt to prevent accidental deletion. Changes reflect immediately.

### 2. Search & Filter Functionality
- **Search:** Find menu items by typing any part of the dish name, results update in real time.
- **Filter:** Filter the menu to show only Starters, only Main Courses, or only Desserts.
- **Clear controls:** One button to clear search and filter and show the full menu again.

### 3. Menu Statistics Screen
Displays useful information at a glance:
- Total number of menu items
- Number of items per course (Starters / Main Courses / Desserts)
- Average price per course
- Automatically updates as items are added, edited, or removed

---

##  REFACTORING & IMPROVEMENTS

### 1. Layout & UI Improvements
- **Fixed header/title positioning:** Added top padding so the screen title ("Add New Menu Item", etc.) is no longer cut off or positioned too close to the top of the screen. Content now displays clearly and is fully visible without needing to scroll or drag down.
- Consistent spacing and padding applied across all screens
- Buttons and form fields aligned uniformly for a cleaner look

### 2. Code Quality Improvements
- **Created reusable `MenuItemCard` component**  instead of repeating the same code for every item, we now use one component that's reused everywhere. This makes the code shorter, easier to read, and easier to update later.
- **Improved naming conventions**  variables and functions now use clear, meaningful names that describe exactly what they do
- **Used `useMemo` hook** for filtering and statistics calculations, improves performance by only recalculating when data actually changes
- **Consistent styling**  colours, fonts, and spacing follow the same design across all screens

### 3. Validation & User Experience
- Added comprehensive form validation, helpful error messages guide the user if they miss a field or enter an invalid price
- Confirmation prompts before deleting items
- Success messages when items are saved or updated
- Clear navigation labels and consistent button placement

---

##  How to Run
1. Clone or download this repository
2. Run `npm install` to install dependencies
3. Run `npx expo start`
4. Open the app using Expo Go on your mobile device or an emulator

---

##  Summary
| Area | Completed |
|---|---|
| Edit & Delete functionality | ✅ |
| Search & Filter | ✅ |
| Statistics Screen | ✅ |
| Layout / UI improvements (header positioning fixed) | ✅ |
| Code refactoring (reusable components) | ✅ |
| Form validation & UX enhancements | ✅ |
| Demo video recorded & accessible | ✅ |

## REFERENCES

Barkhuizen, E. 2026. MAST5112 module guide and assignment brief. Cape Town:
    The Independent Institute of Education (IIE).

Expo. 2026. Expo documentation. [Online] Available from:
    https://docs.expo.dev/. [Accessed 28 September 2026].

Meta Platforms. 2026. React Native documentation. [Online] Available from:
    https://reactnative.dev/. [Accessed 28 September 2026].

npm. 2026. @react-native-picker/picker. [Online] Available from:
    https://www.npmjs.com/package/@react-native-picker/picker.
    [Accessed 28 September 2026].
