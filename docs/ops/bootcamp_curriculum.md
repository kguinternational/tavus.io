# 5-Day Bootcamp Curriculum

## Day 1: The Foundations of Automation
**Goal:** Understand the canvas, data flow, and the JSON object.
- **Morning**: What is an API? What is a Webhook? 
- **Afternoon**: Introduction to n8n. Navigating the canvas. The concept of "Items" and JSON arrays.
- **Exercise**: Build a simple Webhook to Google Sheets workflow.

## Day 2: Building for the Real World (Error Handling)
**Goal:** Stop building fragile automations.
- **Morning**: Introduction to the n8n-spec methodology. Why things break.
- **Afternoon**: Error triggers, the "Continue On Fail" setting, and the Switch node.
- **Exercise**: Refactor Day 1's workflow to handle a scenario where Google Sheets returns an error.

## Day 3: Idempotency & The Spec-Builder
**Goal:** Ensure workflows can safely run multiple times.
- **Morning**: What is Idempotency? (e.g., check if a user exists before creating them).
- **Afternoon**: Using the `n8n-spec-builder` AI to design workflows before building. 
- **Exercise**: Spec out a complex onboarding workflow using the AI assistant, defining the MVP and micro-sprints.

## Day 4: Complex Logic & Sub-Workflows
**Goal:** Modularize workflows for scale.
- **Morning**: Introduction to the Execute Workflow node. Why we fan-out data.
- **Afternoon**: Working with the HTTP Request node and pagination.
- **Exercise**: Build a parent workflow that triggers a child workflow for each item in a list.

## Day 5: Prototyping & The Executive Demo
**Goal:** Build and present a real business use case.
- **Morning**: Employees use the micro-sprint architecture to build the workflow they specced on Day 3.
- **Afternoon**: Submitting workflows to the Nhil Reviewer Agent.
- **Wrap-up**: Presentation of the working automations to department heads.
