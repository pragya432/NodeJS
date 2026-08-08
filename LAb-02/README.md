# Node.js Lab - Lab 02

## Lab Number
Lab 02

## Title
Building Your First Node.js Server

## Date
August 8, 2026

## Objective

The objective of this lab is to understand how Node.js handles HTTP requests and responses using the core `http` module. The lab also demonstrates multiple routes, JSON responses, 404 handling, and environment variables.

## Routes

| Route | Description |
|---|---|
| `/` | Returns welcome message containing name, scholar number and course |
| `/about` | Returns a short message about me |
| `/college` | Returns college name and semester |
| `/profile` | Returns profile information in JSON format |
| Unknown route | Returns 404 Page Not Found |

## How to Run

Run the following command:

```bash
node server.js