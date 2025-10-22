# ChatGPT Actions Setup Guide

## Overview

This guide shows you how to integrate the Dynamic Widgets API with ChatGPT using GPT Actions.

## Base URL

```
https://frontend-production-d329.up.railway.app
```

## OpenAPI Schema

Import the OpenAPI schema from:

```
https://frontend-production-d329.up.railway.app/openapi.json
```

## Available Widget Types

### 1. Dashboard Widget

Display key metrics with changes.

**Example Request:**
```json
POST /api/widgets
{
  "type": "dashboard",
  "title": "Sales Dashboard Q4 2025",
  "metrics": [
    {
      "value": "$125,430",
      "label": "Total Revenue",
      "color": "text-green-600",
      "change": "+18%"
    },
    {
      "value": "1,234",
      "label": "New Customers",
      "color": "text-blue-600",
      "change": "+12%"
    }
  ]
}
```

### 2. Chart Widget

Display data in bar, line, pie, or doughnut charts.

**Example Request:**
```json
POST /api/widgets
{
  "type": "chart",
  "title": "Monthly Sales 2025",
  "chartType": "bar",
  "data": [15000, 22000, 18000, 28000, 32000, 25000],
  "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
}
```

**Chart Types:**
- `bar` - Bar chart
- `line` - Line chart
- `pie` - Pie chart
- `doughnut` - Doughnut chart

### 3. Table Widget

Display tabular data.

**Example Request:**
```json
POST /api/widgets
{
  "type": "table",
  "title": "Top Products",
  "headers": ["Product", "Category", "Sales", "Stock"],
  "rows": [
    ["iPhone 15 Pro", "Technology", "$89,450", "125"],
    ["MacBook Air M3", "Computers", "$145,320", "45"]
  ]
}
```

### 4. Timeline Widget

Display events chronologically.

**Example Request:**
```json
POST /api/widgets
{
  "type": "timeline",
  "title": "Project History",
  "events": [
    {
      "date": "January 15, 2025",
      "title": "Beta Launch",
      "description": "First beta version released to public",
      "color": "blue"
    },
    {
      "date": "March 1, 2025",
      "title": "Version 1.0",
      "description": "Official launch with all features",
      "color": "green"
    }
  ]
}
```

**Available Colors:** `blue`, `green`, `purple`, `orange`, `red`

### 5. Comparison Widget

Compare different options or plans side by side.

**Example Request:**
```json
POST /api/widgets
{
  "type": "comparison",
  "title": "Plan Comparison",
  "items": [
    {
      "name": "Basic Plan",
      "price": "$9/month",
      "features": ["5 users", "10GB storage", "Email support"],
      "highlight": false
    },
    {
      "name": "Pro Plan",
      "price": "$29/month",
      "features": ["Unlimited users", "100GB storage", "24/7 support", "API access"],
      "highlight": true
    }
  ]
}
```

## API Endpoints

### GET /api/widgets

Get all available widgets or a specific widget.

**Parameters:**
- `type` (optional): dashboard | chart | table | timeline | comparison

**Response:**
```json
{
  "success": true,
  "widgets": ["dashboard", "chart", "table", "timeline", "comparison"],
  "data": { ... }
}
```

### POST /api/widgets

Create a custom widget and get a URL to display it.

**Response:**
```json
{
  "success": true,
  "widget": { ... },
  "url": "https://frontend-production-d329.up.railway.app/widget/chart"
}
```

## Viewing Widgets

After creating a widget, users can view it at:

```
https://frontend-production-d329.up.railway.app/widget?type={type}
```

Or use the URL returned in the API response.

## GPT Instructions Example

Add these instructions to your GPT:

```
When the user asks for visualizations, dashboards, or data displays:

1. Use the createWidget action to generate the appropriate widget
2. Explain what the widget shows
3. Provide the URL for the user to view the interactive widget
4. Ask if they want to customize any aspect of the widget

Available widget types:
- Dashboard: For key metrics and KPIs
- Chart: For numerical data visualization (bar, line, pie, doughnut)
- Table: For structured tabular data
- Timeline: For chronological events
- Comparison: For side-by-side comparisons

Always include the widget URL in your response so users can view the interactive visualization.
```

## Testing

Test the API using curl:

```bash
# Get all widgets
curl https://frontend-production-d329.up.railway.app/api/widgets

# Create a chart widget
curl -X POST https://frontend-production-d329.up.railway.app/api/widgets \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chart",
    "title": "Test Chart",
    "chartType": "bar",
    "data": [10, 20, 30, 40],
    "labels": ["A", "B", "C", "D"]
  }'
```

## Error Handling

The API returns proper HTTP status codes:

- `200`: Success
- `400`: Bad request (invalid type or missing required fields)
- `500`: Server error

Error response format:
```json
{
  "success": false,
  "error": "Error message here"
}
```
