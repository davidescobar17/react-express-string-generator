# React Express String Generator

Allows the specification of a series of rules incorporating randomisation to generate a string and copy that string to the clipboard if needed. The rules are evaluated from left to right to generate the string.

These rules take random characters from a given set. By default, the sets are letters, numbers and symbols. Also, the user can input their own set of characters or terms. In a rule, the count of characters or terms from the set can be either a range or specific.

Try it at https://string-generator-9349.herokuapp.com/

## Built With
  - React
  - Bootstrap
  - Express

## Getting Started

This shows how to get a local copy of the project running for development.

### Prerequisites

Install the packages
  
    npm install

### Usage

Either run the frontend
  
    npm run client

Or run using the backend to serve static files
  
    npm run build
    npm run server