-- Migration: 20240101000001_add_photo_and_house.sql
-- Description: Add photo_url and house columns to students table

ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS house TEXT;
