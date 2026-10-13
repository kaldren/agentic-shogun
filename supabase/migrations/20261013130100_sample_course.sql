-- Sample course for testing (content/sample-course.md). It is a migration,
-- not seed.sql, so `supabase db push` adds it to production too.
insert into public.courses (id, role, title) values
  ('marketing', 'marketing', 'AI agents for marketing');

insert into public.sections (id, course_id, position, title) values
  ('marketing-getting-started', 'marketing', 1, 'Getting started with AI agents');

insert into public.lessons (id, section_id, position, title) values
  ('what-is-an-ai-agent', 'marketing-getting-started', 1, 'What is an AI agent?'),
  ('agents-in-marketing-work', 'marketing-getting-started', 2, 'Agents in your marketing work');
