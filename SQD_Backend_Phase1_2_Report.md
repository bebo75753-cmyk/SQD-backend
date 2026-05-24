# SQD Backend -- Phase 1 & Phase 2 Review Report

------------------------------------------------------------------------

## Project Overview

SQD (Student Quality Detector) is a backend system built using: -
Node.js - Express - MongoDB - TypeScript - Mongoose - Zod Validation

The system follows a layered modular architecture separating: - Models -
Repositories - Services - Routes - Validation - DTOs

------------------------------------------------------------------------

# PHASE 1 -- Core System

## 1. Architecture

The backend uses a clean layered architecture:

-   Model → Database schema
-   Repository → Data access layer
-   Service → Business logic
-   Routes → API layer
-   Validation → Request validation
-   DTO → Type inference

Example: - RegistrationModel - RegistrationRepository -
RegistrationService - registration.routes.ts

------------------------------------------------------------------------

## 2. Authentication (JWT)

-   Login generates JWT
-   All protected routes use authentication middleware
-   Token is decoded and user is attached to request

------------------------------------------------------------------------

## 3. Authorization (Role-Based Access)

Roles: - STUDENT - DOCTOR

Examples: - Student creates registration - Doctor approves/rejects
registration

------------------------------------------------------------------------

## 4. Registration Module

Fields: - UserID - courseID - semester - status

Business Rules: - Prevent duplicate registration - Doctor approval
required

Database Constraint: Compound Unique Index: (UserID + courseID +
semester)

------------------------------------------------------------------------

# PHASE 2 -- Smart Attendance

## 1. Attendance Concept

-   AI system is the Source of Truth
-   No face images stored
-   Only final result stored (PRESENT / ABSENT)

------------------------------------------------------------------------

## 2. Attendance Model

Fields: - UserID - courseID - date - status

Compound Unique Index: (UserID + courseID + date)

------------------------------------------------------------------------

## 3. AI Authentication

-   AI uses API Key
-   Not JWT
-   Isolated from human users

Header: x-api-key: AI_SECRET_123

------------------------------------------------------------------------

## 4. Batch Attendance Optimization

Instead of 80 separate database queries:

1.  Fetch existing records once
2.  Filter in memory
3.  Insert in one batch

Benefits: - Scalable - High performance - Prevents N+1 query problem

------------------------------------------------------------------------

## 5. Security Design

POST /attendance → AI API Key only\
GET attendance → JWT (Doctor / Student)

------------------------------------------------------------------------

## 6. Validation Layer

All requests validated using Zod before reaching business logic.

Example: - Regex for UserID - Enum validation for status - Required
fields enforcement

------------------------------------------------------------------------

# Key Design Decisions

1.  Separate AI and human authentication
2.  Use compound unique indexes
3.  Avoid storing biometric data
4.  Use batch insertion for scalability
5.  Layered architecture separation

------------------------------------------------------------------------

# Discussion Preparation -- Important Points

-   Why not store images? → Privacy & storage efficiency
-   How duplicates prevented? → Unique index + pre-check filtering
-   How scalability handled? → Single read + single batch insert
-   Why separate AI auth? → AI is system actor, not user

------------------------------------------------------------------------

# Phase Completion Status

Phase 1: Completed\
Phase 2: Completed\
Phase 3: Ready to Start

------------------------------------------------------------------------

End of Report
# phase 5 
1. Doctor creates exam
2. Student starts exam
3. Student gets exam
4. Student submits
5. Student checks result
6. Doctor checks all results
//Doctor prepares exam
↓
Student enters exam
↓
Student solves exam
↓
System grades automatically
↓
Results appear
/////////////////////////////////////////////