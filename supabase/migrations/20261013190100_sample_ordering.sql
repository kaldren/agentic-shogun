-- Ordering sample (spec 011): exercise 2 of "Design a RAG app on Azure"
-- (content/sample-course-developers.md).
-- Items are stored in a mixed order that is never the correct one.
insert into public.exercises (lesson_id, position, type, content, solution, explanation) values
  ('design-a-rag-app-on-azure', 2, 'ordering',
   '{
     "question": "Put the steps in order, from first to last.",
     "scenario": "An employee asks the chat assistant from the last exercise a question. What happens next?",
     "items": [
       {"id": "retrieve", "label": "AI Search finds the most relevant document chunks"},
       {"id": "answer", "label": "The LLM writes an answer based on the chunks"},
       {"id": "ask", "label": "The employee sends a question from the web app"},
       {"id": "prompt", "label": "The backend sends the question and the chunks to the LLM"},
       {"id": "embed", "label": "The backend turns the question into an embedding"}
     ]
   }',
   '{"order": ["ask", "embed", "retrieve", "prompt", "answer"]}',
   'The question goes from the web app to the backend, which turns it into an embedding. AI Search uses the embedding to find the chunks that match best. Only then does the backend send the question and those chunks to the LLM, so the answer is based on your documents.');
