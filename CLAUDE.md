# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vanishing Notes is a simple frontend-only webapp built with Vite. The application has no backend and is designed to be deployed to GitHub Pages.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview the built app locally

## Architecture

- **Framework**: React 18 with TypeScript and Vite
- **Entry point**: `index.html` - Single HTML file with basic structure
- **Build tool**: Vite - Handles bundling and development server
- **Editor**: MDXEditor for rich markdown editing
- **Markdown Processing**: Marked library for converting markdown to HTML in note snippets
- **Icons**: Lucide React for modern flat icons
- **Storage**: Browser localStorage for data persistence
- **Styling**: CSS with responsive design and Material Design patterns (FAB)
- **Output**: `dist/` directory contains the built static files
- **Deployment**: Automated via GitHub Actions to GitHub Pages

## Key Features

- **Vanishing Notes**: Notes automatically fade and delete after configurable time periods
- **Visual Fade Effect**: Note cards fade from bright yellow to pale as they age
- **Markdown Editor**: Rich text editing with MDXEditor supporting headings, lists, formatting
- **Smart Snippets**: Note previews show formatted markdown content with proper HTML rendering
- **Cards View**: Google Keep-style yellow post-it grid layout showing note previews
- **Floating Action Button**: Material Design FAB for creating new notes
- **Modern Icons**: Clean Lucide React icons throughout the interface
- **Responsive Design**: Mobile-optimized layout that keeps header elements inline
- **Settings**: Configurable note expiration timing
- **No Backend**: Entirely client-side application using localStorage

## Code Structure

```
src/
├── components/           # React components
│   ├── HomeScreen.tsx   # Main notes grid view
│   ├── NoteEditor.tsx   # MDXEditor integration
│   └── Settings.tsx     # App configuration
├── hooks/
│   └── useNotes.ts      # Notes management hook
├── types/
│   └── Note.ts          # TypeScript interfaces
├── utils/
│   └── storage.ts       # localStorage utilities and helpers
└── App.tsx              # Main app router
```

## Deployment

The project uses GitHub Actions for automated deployment:
- Triggers on pushes to `main` branch
- Uses Node.js 22 and official GitHub Pages actions
- Builds with `npm run build` and deploys `dist/` folder
- Separate build and deploy jobs with scoped permissions

The live site is available at: https://vanishing-notes.sumitgouthaman.com