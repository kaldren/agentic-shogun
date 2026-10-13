-- Sample course for the Software developers role
-- (content/sample-course-developers.md).
insert into public.courses (id, role, title) values
  ('software-developers', 'software-developers', 'AI apps on Azure');

insert into public.sections (id, course_id, position, title) values
  ('developers-rag', 'software-developers', 1, 'Build with retrieval-augmented generation (RAG)');

insert into public.lessons (id, section_id, position, title) values
  ('design-a-rag-app-on-azure', 'developers-rag', 1, 'Design a RAG app on Azure');

-- Cards are listed in a mixed order so the bank doesn't give the answer away.
insert into public.exercises (lesson_id, position, type, content, solution, explanation) values
  ('design-a-rag-app-on-azure', 1, 'architecture',
   '{
     "question": "Drag each Azure service to its place in the architecture.",
     "scenario": "Your company wants a chat assistant that answers employee questions using internal PDF documents, like HR policies and product manuals. Employees use it in the browser. Answers must be based on the documents, not on what the model happens to remember.",
     "slots": [
       {"id": "frontend", "label": "Web frontend"},
       {"id": "api", "label": "Backend API"},
       {"id": "search", "label": "Vector and keyword search"},
       {"id": "llm", "label": "LLM and embeddings"},
       {"id": "storage", "label": "Document storage"},
       {"id": "processing", "label": "Document processing"}
     ],
     "cards": [
       {"id": "iot-hub", "label": "Azure IoT Hub"},
       {"id": "ai-search", "label": "Azure AI Search"},
       {"id": "static-web-apps", "label": "Azure Static Web Apps"},
       {"id": "document-intelligence", "label": "Azure AI Document Intelligence"},
       {"id": "notification-hubs", "label": "Azure Notification Hubs"},
       {"id": "azure-openai", "label": "Azure OpenAI in Microsoft Foundry"},
       {"id": "blob-storage", "label": "Azure Blob Storage"},
       {"id": "virtual-desktop", "label": "Azure Virtual Desktop"},
       {"id": "container-apps", "label": "Azure Container Apps"}
     ],
     "flows": [
       {"title": "Answer a question", "stages": [["frontend"], ["api"], ["search", "llm"]]},
       {"title": "Add documents", "stages": [["storage"], ["processing"], ["search"]]}
     ]
   }',
   '{"slots": {"frontend": "static-web-apps", "api": "container-apps", "search": "ai-search", "llm": "azure-openai", "storage": "blob-storage", "processing": "document-intelligence"}}',
   'New PDFs land in Blob Storage, Document Intelligence pulls out their text, and AI Search keeps the chunks with their embeddings. When someone asks a question, the frontend on Static Web Apps calls the API on Container Apps. The API finds the best chunks in AI Search and sends them with the question to Azure OpenAI, which writes an answer grounded in your documents.');
