# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vanishing Notes is a simple frontend-only webapp built with Vite. The application has no backend and is designed to be deployed to GitHub Pages.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview the built app locally

## Architecture

- **Entry point**: `index.html` - Single HTML file with basic structure
- **Build tool**: Vite - Handles bundling and development server
- **Output**: `dist/` directory contains the built static files
- **Deployment**: Automated via GitHub Actions to GitHub Pages

## Deployment

The project uses GitHub Actions for automated deployment:
- Triggers on pushes to `main` branch
- Uses Node.js 22 and official GitHub Pages actions
- Builds with `npm run build` and deploys `dist/` folder
- Separate build and deploy jobs with scoped permissions

The live site is available at: https://vanishing-notes.sumitgouthaman.com