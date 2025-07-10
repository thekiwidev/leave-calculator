# Changelog

All notable changes to the Advanced Leave Calculator project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.3] - Result View Responsiveness Fix

- **Fixed** empty result placeholder now shows properly on desktop
- **Enhanced** responsive behavior by hiding empty result view only on mobile devices
- **Added** proper responsive breakpoints for result view visibility
- **Improved** empty state UX with desktop-only placeholder message

## [2.0.2] - UI Visibility Improvements

- **Enhanced** mobile experience by hiding results view when no calculation is available
- **Improved** UI clarity by hiding public holidays section when no holidays are skipped
- **Removed** empty state placeholder to reduce visual clutter on mobile devices
- **Optimized** screen space usage with conditional rendering of result sections
- **Enhanced** user experience by only showing relevant information when needed

## [2.0.1] - NotPublicHolidayManager UI Consistency Update

- **Enhanced** NotPublicHolidayManager to match PublicHolidayManager's look and feel
- **Added** hidden add form by default with dedicated "Add Date" button to toggle visibility
- **Improved** form layout from 3-column to 2-column grid matching PublicHolidayManager style
- **Added** Cancel button functionality to hide form without saving changes
- **Enhanced** list items with consistent styling including hover effects and visual indicators
- **Added** proper Card wrapper for excluded dates list with improved spacing and structure
- **Improved** batch operations layout with consistent border separation and styling
- **Enhanced** empty state styling to match PublicHolidayManager's professional appearance
- **Added** "Manual" badge to all excluded dates for visual consistency
- **Improved** responsive design with proper mobile-friendly layouts
- **Enhanced** user experience with consistent interaction patterns across both holiday managers

## [2.0.0] - Supabase Database Integration for Universal Storage

- **Added** Supabase integration as universal storage system for public holidays
- **Replaced** localStorage with Supabase PostgreSQL database for persistent holiday storage
- **Added** real-time synchronization across all app instances using Supabase subscriptions
- **Implemented** automatic API holiday sync to database with duplicate prevention
- **Added** comprehensive error handling for all database operations
- **Enhanced** holiday management with instant updates across all connected clients
- **Added** robust offline fallback that gracefully handles network issues
- **Created** dedicated Supabase service layer for clean database interactions
- **Implemented** async/await pattern for all holiday CRUD operations
- **Added** automatic cleanup of real-time subscriptions on app unmount
- **Enhanced** store architecture to handle both API syncing and manual holiday management
- **Maintained** backward compatibility with existing local preferences storage
- **Added** detailed logging for database operations and error tracking
- **Improved** user experience with proper loading states during database operations
- **Enhanced** Add Holiday button with loading state showing spinner and "Adding..." text during save operation
- **Added** button disable state during add operation to prevent double submissions
- **Extended** Supabase integration to "Not Public Holidays" with dedicated `not_public_holidays` table
- **Added** real-time synchronization for excluded holiday dates across all app instances
- **Enhanced** NotPublicHolidayManager with Supabase storage and loading states
- **Implemented** async operations for adding, removing, and batch deleting excluded dates
- **Added** comprehensive error handling and user feedback for excluded dates management
- **Replaced** localStorage with Supabase for excluded dates persistence and real-time updates
- **Fixed** unused import warning by removing unnecessary `fetchNotPublicHolidaysFromSupabase` import from store

## [1.4.3] - Dynamic Greeting Header with Real-Time Clock

- **Replaced** dark gradient header with clean, light design featuring dynamic greeting
- **Added** real-time date and time display that updates every second
- **Enhanced** header with contextual greetings based on time of day (Good Morning/Afternoon/Evening)
- **Improved** visual design with light background, blue accent colors, and better spacing
- **Added** separate date and time sections with Calendar and Clock icons for better readability
- **Enhanced** header layout with greeting on left side and date/time on right side
- **Updated** header styling to be more welcoming and informative for daily use
- **Fixed** mobile layout with stacked date/time for better readability on small screens
- **Enhanced** calendar icon with gray background and black icon for better contrast
- **Added** interactive calendar modal that opens when tapping the calendar icon
- **Improved** responsive design with different layouts for desktop and mobile views
- **Added** full calendar view with proper styling and close functionality
- **Enhanced** calendar modal to use shadcn/ui Calendar component for better design consistency
- **Added** dual-month calendar view showing current and next month for better navigation
- **Improved** calendar modal width and spacing for better user experience
- **Updated** calendar to single-month view with year/month dropdown navigation (2020-2030 range)
- **Enhanced** modal background opacity to 75% for better focus and visual separation
- **Fixed** calendar centering within modal for proper visual balance
- **Repositioned** navigation chevrons to sides of month/year dropdowns matching start date picker layout
- **Improved** calendar navigation layout with proper spacing and positioning
- **Added** refresh button in footer to clear cache and pull fresh data while preserving localStorage
- **Enhanced** app refresh functionality that clears service worker caches but maintains user data
- **Improved** user experience with easy access to refresh app for updates without losing holidays

## [1.4.2] - PWA Functionality and UI Fixes

- **Fixed** PWA detection in Chrome by adding proper manifest link to index.html
- **Fixed** resumption date card to only show adjustment text when dates are actually shifted due to holidays
- **Enabled** PWA functionality in development mode via vite.config.ts devOptions
- **Removed** manual service worker registration (now handled automatically by Vite PWA plugin)
- **Improved** PWA installability and manifest serving in development environment

## [1.4.1] - Proper Icon and Favicon Integration

- **Added** proper favicon.ico and app icons (192x192, 512x512) for professional PWA experience
- **Added** Apple touch icon for iOS devices with proper meta tag integration
- **Updated** PWA manifest to use proper PNG icons instead of placeholder SVG
- **Enhanced** icon configuration with both standard and maskable icon purposes
- **Fixed** favicon link type from SVG to proper ICO format in index.html
- **Improved** PWA installability with proper icon assets for all device types

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
