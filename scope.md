# Event Management Portal - Scope Document

## Project Overview

### Project Name

Event Management Portal

### Objective

The Event Management Portal is a web-based application designed to manage customer inquiries, event bookings, event schedules, payments, expenses, inventory, vehicles, and overall event operations from a centralized platform.

---

## Technology Stack

### Frontend

* React.js
* React Router
* Axios
* Material UI / Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MySQL

### ORM

* Prisma ORM

### Database Management

* phpMyAdmin

### Authentication

* JWT (JSON Web Token)

### Version Control

* Git
* GitHub

---

# Module 1: Customer Management

## Purpose

Manage customer inquiries, bookings, and event details.

## Features

### Create Customer

Add new customer inquiry and booking details.

### Customer Fields

| Field                 | Type                                   |
| --------------------- | -------------------------------------- |
| Customer ID           | Auto Generated                         |
| Customer Name         | Text                                   |
| Mobile Number         | Number                                 |
| Email                 | Email                                  |
| Address               | Text                                   |
| Function Type         | Dropdown                               |
| Function Date         | Date                                   |
| Function Plan         | Dropdown                               |
| Location              | Text                                   |
| Estimation Amount Min | Currency                               |
| Estimation Amount Max | Currency                               |
| Order Status          | Pending / Confirmed / Lost / Completed |
| Notes                 | Text                                   |
| Created Date          | Auto Generated                         |

### Customer Operations

* Create Customer
* Edit Customer
* View Customer
* Delete Customer
* Search Customer
* Filter by Status

### Order Status Flow

```text
Pending
   ↓
Confirmed
   ↓
Completed

OR

Pending
   ↓
Lost
```

---

# Module 2: Event Calendar

## Purpose

Display scheduled events in a calendar view.

## Features

* Monthly Calendar View
* Weekly Calendar View
* Daily Calendar View
* Event Detail Popup
* Status Color Indicators
* Event Search

## Calendar Data Source

Events are automatically generated from confirmed bookings in Customer Management.

### Example Event Display

```text
25-Jun-2026

Customer: Arun Kumar
Function: Birthday
Location: Trichy
Status: Confirmed
```

## Filters

* Month
* Year
* Function Type
* Event Status
* Location

---

# Module 3: Payment Tracker

## Purpose

Track customer payments and outstanding balances.

## Features

* Advance Payment Entry
* Multiple Payment Transactions
* Pending Amount Calculation
* Payment History
* Outstanding Report

## Fields

| Field                 | Type                                |
| --------------------- | ----------------------------------- |
| Payment ID            | Auto Generated                      |
| Customer ID           | Reference                           |
| Customer Name         | Auto Filled                         |
| Total Amount          | Currency                            |
| Paid Amount           | Currency                            |
| Pending Amount        | Auto Calculated                     |
| Payment Method        | Cash / UPI / Bank Transfer / Cheque |
| Transaction Reference | Text                                |
| Payment Date          | Date                                |
| Payment Status        | Not Paid / Partial / Paid           |
| Remarks               | Text                                |

## Filters

* Confirmed Orders
* Completed Orders
* Payment Status
* Date Range

---

# Module 4: Expense Management

## Purpose

Track all event-related expenses.

## Features

* Add Expense
* Edit Expense
* Delete Expense
* Event-wise Expense Tracking
* Expense Reports

## Expense Categories

* Catering
* Decoration
* Photography
* Transportation
* Venue
* Accommodation
* Printing
* Miscellaneous

## Fields

| Field            | Type           |
| ---------------- | -------------- |
| Expense ID       | Auto Generated |
| Event ID         | Reference      |
| Expense Category | Dropdown       |
| Amount           | Currency       |
| Expense Date     | Date           |
| Description      | Text           |
| Attachment       | File Upload    |

---

# Module 5: Vendor Management

## Purpose

Manage external service providers.

## Vendor Types

* Catering
* Decoration
* Photography
* DJ
* Sound System
* Transportation

## Fields

| Field           | Type              |
| --------------- | ----------------- |
| Vendor ID       | Auto Generated    |
| Vendor Name     | Text              |
| Mobile Number   | Number            |
| Email           | Email             |
| Address         | Text              |
| Service Type    | Dropdown          |
| Contract Amount | Currency          |
| Status          | Active / Inactive |

---

# Module 6: Inventory Management

## Purpose

Track event materials and equipment.

## Features

* Stock In
* Stock Out
* Inventory Tracking
* Low Stock Alert

## Fields

| Field              | Type            |
| ------------------ | --------------- |
| Item ID            | Auto Generated  |
| Item Name          | Text            |
| Category           | Text            |
| Quantity Available | Number          |
| Quantity Used      | Number          |
| Remaining Quantity | Auto Calculated |

---

# Module 7: Vehicle Management

## Purpose

Manage vehicles used during events.

## Features

* Vehicle Assignment
* Driver Assignment
* Maintenance Tracking
* Fuel Tracking

## Fields

| Field          | Type                               |
| -------------- | ---------------------------------- |
| Vehicle ID     | Auto Generated                     |
| Vehicle Number | Text                               |
| Vehicle Type   | Text                               |
| Driver Name    | Text                               |
| Capacity       | Number                             |
| Status         | Available / Assigned / Maintenance |

---

# Module 8: Event Task Management

## Purpose

Track event preparation and execution tasks.

## Features

* Task Creation
* Task Assignment
* Progress Tracking
* Completion Tracking

## Fields

| Field       | Type                              |
| ----------- | --------------------------------- |
| Task ID     | Auto Generated                    |
| Event ID    | Reference                         |
| Task Name   | Text                              |
| Assigned To | User                              |
| Due Date    | Date                              |
| Status      | Pending / In Progress / Completed |

---

# Module 9: Dashboard

## Features

### Customer Statistics

* Total Customers
* Pending Orders
* Confirmed Orders
* Lost Orders
* Completed Orders

### Event Statistics

* Upcoming Events
* Today's Events
* Monthly Events

### Financial Statistics

* Total Revenue
* Total Expenses
* Pending Payments
* Profit Summary

---

# Module 10: Reports

## Customer Reports

* Customer List Report
* Inquiry Report
* Lost Order Report

## Event Reports

* Upcoming Events Report
* Monthly Event Report

## Financial Reports

* Payment Report
* Pending Payment Report
* Expense Report
* Profit & Loss Report

---

# User Roles & Permissions

## Admin

Full system access.

## Sales Executive

* Customer Management
* Event Booking

## Finance User

* Payment Management
* Expense Management

## Operations User

* Inventory Management
* Vehicle Management
* Task Management

---

# Database Tables

```sql
users
customers
events
payments
expenses
vendors
inventory_items
inventory_transactions
vehicles
event_tasks
attachments
```

---

# Future Enhancements

## Phase 2

* WhatsApp Integration
* SMS Notifications
* Email Notifications
* Quotation Generator
* Online Payment Gateway
* Customer Portal

## Phase 3

* Mobile Application
* Staff Attendance
* QR Event Check-in
* AI Budget Estimation
* Event Cost Forecasting

---

# Minimum Viable Product (MVP)

Version 1 Release:

1. Customer Management
2. Event Calendar
3. Payment Tracker
4. Expense Management
5. Dashboard
6. Reports
7. User Management

This MVP provides a complete event booking and financial tracking solution and can be extended with inventory, vendor, and vehicle management modules in future releases.
