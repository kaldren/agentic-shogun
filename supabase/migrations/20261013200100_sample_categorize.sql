-- Categorize sample (spec 012): exercise 2 of "Build an order pipeline"
-- (content/sample-course-event-driven.md).
insert into public.exercises (lesson_id, position, type, content, solution, explanation) values
  ('build-an-order-pipeline', 2, 'categorize',
   '{
     "question": "Where does each piece of work belong?",
     "buckets": [
       {"id": "api", "label": "Order API (answers right away)"},
       {"id": "worker", "label": "Background worker"}
     ],
     "items": [
       {"id": "save", "label": "Save the order in the database"},
       {"id": "validate", "label": "Check that the order is valid"},
       {"id": "email", "label": "Send the confirmation email"},
       {"id": "enqueue", "label": "Put the order on the queue"},
       {"id": "reply", "label": "Reply with an order number"}
     ]
   }',
   '{"items": {"validate": "api", "enqueue": "api", "reply": "api", "save": "worker", "email": "worker"}}',
   'The API does only the quick work: it checks the order, puts it on the queue and replies, so customers never wait. Saving the order and sending the email are slower, so the worker does them later, at its own pace.');
