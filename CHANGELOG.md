# Changelog

All notable changes to the Advanced Leave Calculator project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
