# Micro-Sprint Architecture

## Overview
The Micro-Sprint Architecture is the pedagogical and technical framework used in the Nhil.net 5-Day Bootcamp. It forces employees to build in small, testable chunks rather than attempting "spaghetti automation".

## The Rules of Micro-Sprints

1. **The 2-Node Limit**: A micro-sprint can consist of no more than 2 nodes (e.g., Trigger + HTTP Request, or Webhook + Set Node).
2. **Execute and Verify**: After building the 2 nodes, the employee MUST execute the workflow and verify the output JSON.
3. **Document**: The employee must pin the output data to serve as mock data for the next micro-sprint.

## The "I Do, We Do, You Do" Model
For each micro-sprint during the bootcamp:
- **I Do**: The instructor builds the 2 nodes on screen, explaining the 'why'.
- **We Do**: The class builds the same 2 nodes together, step-by-step.
- **You Do**: The employees apply the same concept to their own specific use case.

## Enforcement
The `n8n-spec-builder` AI Skill enforces this by refusing to provide full workflow solutions. It will only guide the user through the current micro-sprint, demanding proof of success before moving on.
