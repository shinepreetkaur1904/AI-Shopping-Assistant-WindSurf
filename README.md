# ShopWise AI Shopping Assistant

ShopWise is an AI-powered shopping assistant that helps users make smarter buying decisions by analyzing product reviews and providing personalized recommendations.

## Features

- Smart product search
- Review analysis and sentiment detection
- Personalized product recommendations
- Interactive follow-up questions for better suggestions

## Tech Stack

- React.js
- Material-UI
- Axios for API calls

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Usage

1. Enter a product name in the search field
2. View analyzed reviews and recommendations
3. Answer follow-up questions to get more personalized suggestions

## Note

Currently using mock data for demonstration. To use real product data, you'll need to:
1. Sign up for a product review API (e.g., Amazon Product API)
2. Add your API credentials to the environment variables
3. Update the API integration in the handleSearch function
