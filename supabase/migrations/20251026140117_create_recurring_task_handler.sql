/*
  # Add Recurring Task Functionality

  1. Overview
    This migration implements automatic handling of recurring tasks in the checklist.
    When a task with a recurrence setting is marked as completed, a new task is
    automatically created with updated dates based on the recurrence interval.

  2. New Function
    - `handle_recurring_task()` - PostgreSQL function that:
      - Triggers when a checklist_item is marked as completed (completata = true)
      - Checks if the task has a recurrence setting (ricorrente != 'none')
      - Creates a new task with the same properties but updated dates
      - Calculates next due date based on recurrence type:
        * giornaliera: +1 day
        * settimanale: +7 days
        * mensile: +1 month
      - Preserves all task properties (text, priority, category, recurrence settings)

  3. Trigger
    - `trigger_recurring_task` - Executes after update on checklist_items
    - Only fires when completata changes from false to true
    - Runs the handle_recurring_task() function

  4. Important Notes
    - Original task remains completed in history
    - New task is created as a separate entry with fresh dates
    - New task maintains the same recurrence setting for future completions
    - If original task has no due date, new task won't have one either
*/

-- Function to handle recurring task creation
CREATE OR REPLACE FUNCTION handle_recurring_task()
RETURNS TRIGGER AS $$
DECLARE
  next_due_date timestamptz;
  next_reminder_date timestamptz;
BEGIN
  -- Only proceed if task is being marked as completed AND has recurrence set
  IF NEW.completata = true AND OLD.completata = false AND NEW.ricorrente != 'none' THEN
    
    -- Calculate next due date based on recurrence type
    IF NEW.data_scadenza IS NOT NULL THEN
      CASE NEW.ricorrente
        WHEN 'giornaliera' THEN
          next_due_date := NEW.data_scadenza + INTERVAL '1 day';
        WHEN 'settimanale' THEN
          next_due_date := NEW.data_scadenza + INTERVAL '7 days';
        WHEN 'mensile' THEN
          next_due_date := NEW.data_scadenza + INTERVAL '1 month';
        ELSE
          next_due_date := NULL;
      END CASE;
    END IF;

    -- Calculate next reminder date if it exists
    IF NEW.data_promemoria IS NOT NULL AND NEW.data_scadenza IS NOT NULL THEN
      -- Maintain the same time difference between reminder and due date
      next_reminder_date := next_due_date - (NEW.data_scadenza - NEW.data_promemoria);
    END IF;

    -- Create new recurring task
    INSERT INTO checklist_items (
      testo,
      completata,
      idraulico_id,
      priorita,
      categoria,
      categoria_custom,
      data_scadenza,
      data_promemoria,
      ricorrente,
      ordine
    ) VALUES (
      NEW.testo,
      false,
      NEW.idraulico_id,
      NEW.priorita,
      NEW.categoria,
      NEW.categoria_custom,
      next_due_date,
      next_reminder_date,
      NEW.ricorrente,
      NEW.ordine
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_recurring_task ON checklist_items;

-- Create trigger to handle recurring tasks
CREATE TRIGGER trigger_recurring_task
  AFTER UPDATE ON checklist_items
  FOR EACH ROW
  WHEN (NEW.completata = true AND OLD.completata = false)
  EXECUTE FUNCTION handle_recurring_task();