# Changelog

All notable changes to the Advanced Leave Calculator project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - Full PWA Support and Branding Update

- **Enhanced** Progressive Web App configuration with comprehensive manifest and service worker setup
- **Added** PWA install banner with smart prompting and session-based dismissal tracking
- **Updated** app branding to reflect OSGF Leave Matters Unit purpose and creator attribution
- **Enhanced** page title and meta description highlighting app purpose for leave drafting process
- **Added** advanced PWA manifest with proper icons, screenshots, and app categorization
- **Updated** header to "Leave Calculator" with subtitle crediting Adedotun and OSGF purpose
- **Enhanced** footer with creator contact information (website: <https://adedotun.xyz>, email: <thekiwidev@adedotun.xyz>)
- **Added** runtime API caching for improved offline experience with NetworkFirst strategy
- **Enhanced** PWA installability with proper display mode detection and install prompting
- **Added** comprehensive meta tags for SEO, Open Graph, and Twitter card support
- **Improved** offline-first capabilities with enhanced service worker caching strategies

## [1.3.2] - Resumption Date Adjustment Transparency

- **Added** resumption date adjustment explanation when resumption falls on public holiday or weekend
- **Added** detailed adjustment information showing original intended date vs actual working day
- **Added** dedicated "Resumption Date Adjustment" section displaying holidays that caused date shifts
- **Enhanced** resumption date card with inline adjustment notes for better user understanding
- **Added** `getNextWorkingDayWithDetails()` utility function for comprehensive date adjustment tracking
- **Improved** leave calculation result type with `resumptionAdjustment` field for transparency
- **Enhanced** user experience by clearly explaining why resumption dates are moved to next working day

## [1.3.1] - Critical Bug Fixes & UX Improvements

- **Fixed** API refresh now preserves manually added public holidays instead of overwriting them
- **Fixed** Added count display for Not Public Holiday Dates in collapsed title view
- **Fixed** Added confirmation dialogs for all delete operations in both holiday managers
- **Added** Batch delete functionality with checkboxes for both public holidays and excluded dates
- **Added** Visual distinction between manual and API-sourced holidays with badges
- **Improved** Enhanced UX with proper AlertDialog confirmations for destructive actions

## [1.3.0] - Not Public Holiday Date Management & Enhanced UX

- **Added** NotPublicHolidayManager component with collapsible interface for excluding specific dates from holiday treatment
- **Added** flexible month/year navigation to all date pickers with dropdown selection (2020-2030 range)
- **Enhanced** leave calculation engine to filter out excluded "not public holiday" dates from holiday calculations
- **Enhanced** date display in results to show day of week (e.g., "Monday, January 15, 2024")
- **Improved** responsive layout for large screens - changed from max-width 4xl to 7xl with better grid proportions
- **Added** persistent storage for excluded holiday dates using localStorage integration
- **Added** day-of-week formatting utility function for consistent date display across components

## [1.2.1] - Calendar and UX Refinements

- **Fixed** calendar date selection timezone issue - now correctly selects the intended date
- **Improved** responsive grid layout for result cards - better width-aware display on large screens
- **Enhanced** start date input with blue color highlighting for better visibility
- **Simplified** date picker to only disable weekends, allowing current and past dates for flexibility
- **Removed** unnecessary pulsing dot indicator from start date input
- **Streamlined** results display by removing redundant start date card
- **Improved** calendar component with proper timezone handling to prevent off-by-one date selection

## [1.2.0] - Shadcn/UI Integration and Enhanced UX

- **Added** Shadcn/UI component library for modern, accessible design system
- **Enhanced** all form components with improved styling and user experience
- **Added** DatePicker component with calendar UI for better date selection
- **Improved** color scheme: red for expiration dates, green for total days calculated
- **Enhanced** public holidays section now collapsed by default for better space usage
- **Added** Card, Button, Input, Select, Badge, and Collapsible components from Shadcn/UI
- **Improved** visual hierarchy with better typography and spacing
- **Enhanced** responsive design with grid layouts and improved mobile experience
- **Added** modern gradient header with improved visual appeal
- **Fixed** delete confirmation showing both icon and "Confirm" text for clarity

## [1.1.0] - Weekend Holiday Handling and UI Improvements

- **Added** automatic shifting of weekend public holidays to next working day
- **Added** "(observed)" marking for shifted holidays to distinguish from original dates
- **Fixed** manual holiday addition now properly saves to localStorage
- **Improved** Grade Level selection simplified to two options: "GL 01-06" and "GL 07-17"
- **Added** collapsible public holidays section for better space management
- **Enhanced** holiday processing logic to handle weekend shifts seamlessly
- **Improved** user experience with clearer holiday management interface

## [1.0.0] - Complete Rewrite and Modernization

- **Complete rewrite** of the leave calculator using modern technologies
- **Added** React 19 with TypeScript for type-safe development
- **Added** Vite 7 build system with fast HMR and PWA capabilities
- **Added** Tailwind CSS 4 for utility-first styling approach
- **Added** Zustand for lightweight, scalable state management
- **Added** date-fns for reliable and accurate date operations
- **Added** Lucide React for beautiful, consistent iconography
- **Added** Progressive Web App (PWA) support with offline capabilities
- **Added** Advanced leave calculation engine following PRD specifications
- **Added** Support for multiple leave types (Vacation, Maternity, Casual, Study, Sick, Sabbatical)
- **Added** Grade Level support for vacation leave entitlements (GL 0-06: 21 days, GL 07+: 30 days)
- **Added** Public holiday management with add/remove functionality
- **Added** API integration with API Ninjas for Nigerian public holidays
- **Added** Local storage persistence for holidays and user preferences
- **Added** Responsive design optimized for all device sizes
- **Added** Real-time validation and comprehensive error handling
- **Added** Working day calculation excluding weekends and public holidays
- **Added** Detailed results showing expiration date, resumption date, and skipped holidays
- **Added** Comprehensive documentation and usage guides
- **Added** TypeScript type definitions for robust development
- **Added** Component-based architecture for maintainability
- **Added** Environment variable support for secure API key management
